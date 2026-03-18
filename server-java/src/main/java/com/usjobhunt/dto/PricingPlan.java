package com.usjobhunt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingPlan {
    private String id;
    private String name;
    private BigDecimal price;
    private String description;
    private List<String> features;
}
