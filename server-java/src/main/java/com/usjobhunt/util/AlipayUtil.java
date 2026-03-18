package com.usjobhunt.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class AlipayUtil {
    
    @Value("${alipay.app-id}")
    private String appId;
    
    @Value("${alipay.merchant-private-key}")
    private String merchantPrivateKey;
    
    @Value("${alipay.gateway-url}")
    private String gatewayUrl;
    
    @Value("${alipay.alipay-public-key}")
    private String alipayPublicKey;
    
    public String generatePaymentUrl(String orderId, String amount, String subject, 
                                     String description, String returnUrl, String notifyUrl) {
        try {
            Map<String, String> params = new TreeMap<>();
            params.put("app_id", appId);
            params.put("method", "alipay.trade.page.pay");
            params.put("format", "JSON");
            params.put("return_url", returnUrl);
            params.put("notify_url", notifyUrl);
            params.put("version", "1.0");
            params.put("sign_type", "RSA2");
            params.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            params.put("charset", "utf-8");
            
            String bizContent = String.format(
                "{\"out_trade_no\":\"%s\",\"total_amount\":\"%s\",\"subject\":\"%s\",\"body\":\"%s\",\"product_code\":\"FAST_INSTANT_TRADE_PAY\"}",
                orderId, amount, subject, description
            );
            params.put("biz_content", bizContent);
            
            String sign = signParams(params);
            params.put("sign", sign);
            
            return buildPaymentUrl(params);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate payment URL", e);
        }
    }
    
    private String signParams(Map<String, String> params) throws Exception {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!"sign".equals(entry.getKey()) && !"sign_type".equals(entry.getKey())) {
                if (sb.length() > 0) {
                    sb.append("&");
                }
                sb.append(entry.getKey()).append("=").append(entry.getValue());
            }
        }
        
        String signContent = sb.toString();
        PrivateKey privateKey = getPrivateKey();
        
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(signContent.getBytes(StandardCharsets.UTF_8));
        
        byte[] signBytes = signature.sign();
        return Base64.getEncoder().encodeToString(signBytes);
    }
    
    private String buildPaymentUrl(Map<String, String> params) throws UnsupportedEncodingException {
        StringBuilder sb = new StringBuilder(gatewayUrl);
        sb.append("?");
        
        boolean first = true;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!first) {
                sb.append("&");
            }
            sb.append(entry.getKey()).append("=").append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
            first = false;
        }
        
        return sb.toString();
    }
    
    private PrivateKey getPrivateKey() throws Exception {
        String privateKeyPEM = merchantPrivateKey
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .replaceAll("\\s+", "");
        
        byte[] decodedKey = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }
}
