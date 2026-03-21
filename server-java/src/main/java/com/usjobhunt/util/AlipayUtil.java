package com.usjobhunt.util;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.alipay.api.response.AlipayTradePagePayResponse;
import com.alipay.api.internal.util.AlipaySignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.Map;

@Component
public class AlipayUtil {
    
    @Value("${alipay.app-id}")
    private String appId;
    
    @Value("${alipay.merchant-private-key}")
    private String merchantPrivateKey;
    
    @Value("${alipay.alipay-public-key}")
    private String alipayPublicKey;
    
    @Value("${alipay.gateway-url}")
    private String gatewayUrl;
    
    @Value("${alipay.encrypt-key:}")
    private String encryptKey;
    
    private AlipayClient alipayClient;

    @PostConstruct
    public void init() {
        // 如果提供了 encryptKey，则开启 AES 加密
        if (encryptKey != null && !encryptKey.trim().isEmpty()) {
            alipayClient = new DefaultAlipayClient(
                gatewayUrl, appId, merchantPrivateKey, "json", "UTF-8", 
                alipayPublicKey, "RSA2", encryptKey, "AES"
            );
        } else {
            alipayClient = new DefaultAlipayClient(
                gatewayUrl, appId, merchantPrivateKey, "json", "UTF-8", 
                alipayPublicKey, "RSA2"
            );
        }
    }
    
    public String generatePaymentUrl(String orderId, String amount, String subject, 
                                     String description, String returnUrl, String notifyUrl) {
        AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();
        request.setReturnUrl(returnUrl);
        request.setNotifyUrl(notifyUrl);
        
        // 构建业务参数
        String bizContent = String.format(
            "{\"out_trade_no\":\"%s\",\"total_amount\":\"%s\",\"subject\":\"%s\",\"body\":\"%s\",\"product_code\":\"FAST_INSTANT_TRADE_PAY\"}",
            orderId, amount, subject, description
        );
        request.setBizContent(bizContent);
        
        // 如果开启了加密，SDK 会自动处理 biz_content 的加密
        if (encryptKey != null && !encryptKey.trim().isEmpty()) {
            request.setNeedEncrypt(true);
        }
        
        try {
            AlipayTradePagePayResponse response = alipayClient.pageExecute(request);
            if (response.isSuccess()) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to generate payment URL: " + response.getMsg());
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException("Alipay API error", e);
        }
    }
    
    public boolean verifySignature(Map<String, String> params) {
        try {
            // 如果开启了加密，验签前可能需要先解密，但支付宝 SDK 的 rsaCheckV1 通常处理的是外层签名
            // 对于异步通知，通常先验签
            return AlipaySignature.rsaCheckV1(params, alipayPublicKey, "UTF-8", "RSA2");
        } catch (AlipayApiException e) {
            return false;
        }
    }
}
