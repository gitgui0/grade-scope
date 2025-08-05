package com.student_predictor.predictor_api;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class RateLimiterFilter extends OncePerRequestFilter {

    private final Map<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final int MAX_REQUESTS = 12; // max requests per timeframe
    private final long TIME_FRAME_MS = 60_000; // timeframe = 60 seconds

    private volatile long windowStart = System.currentTimeMillis();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        long now = System.currentTimeMillis();
        if (now - windowStart > TIME_FRAME_MS) {
            requestCounts.clear(); // reset counts every timeframe
            windowStart = now;
        }

        String clientIp = request.getRemoteAddr(); // or get from header if behind proxy

        requestCounts.putIfAbsent(clientIp, new AtomicInteger(0));
        int requests = requestCounts.get(clientIp).incrementAndGet();

        if (requests > MAX_REQUESTS) {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            String json = "{\"error\": \"Too many requests - try again later\"}";
            response.getWriter().write(json);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
