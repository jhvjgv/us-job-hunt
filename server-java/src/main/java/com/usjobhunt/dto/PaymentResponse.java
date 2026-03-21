package com.usjobhunt.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long orderId;
    private String paymentUrl;
    private PlanInfo plan;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlanInfo {
        private String id;
        private String name;
        private BigDecimal price;
        private String description;
    }
}
