package com.student_predictor.predictor_api;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<RateLimiterFilter> rateLimiterFilter(){
        FilterRegistrationBean<RateLimiterFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RateLimiterFilter());
        registrationBean.addUrlPatterns("/predict");  // Apply only to the /predict endpoint
        return registrationBean;
    }
}
