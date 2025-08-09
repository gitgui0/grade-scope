package com.student_predictor.predictor_api;


import org.apache.coyote.Response;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;



@RestController
public class ApiController {

    @Value("${ml.api.url}")
    private String mlApiUrl;

    @Value("${ml.api.token}")
    private String mlApiToken;

    public String generateAdvice(double behavior, double performance){
        /*
            Calculates normalized difference between the behavior and performance.
                if < 0.1 -> aligned
                if < 0.25 -> some discrepancy
                else -> significant discrepancy
        */

        String advice;
        double diff = behavior- performance;
        double normalizedDiff = Math.abs(behavior- performance) / 20.0;

        if(normalizedDiff < 0.1){
            advice = "Behavioral and Academic performance are aligned. Well done!";
        }else if(normalizedDiff < 0.25){
            if(diff > 0){
                advice = "Your behaviour aspects are strong, but your academic performance is slightly lower";
            }else{
                advice = "You are achieving good academic results," +
                        " but your habits or behavioural aspects won't help at pushing your grade up";
            }
        }else{
            if(diff > 0){
                advice = "There is a major mismatch. Your behaviour suggest high potential," +
                        " but your academic results are underwhelming. Investigate possible obstacles or seek academic support.";
            }else{
                advice = " You're performing well academically, but behavioral indicators" +
                        " show high risk (e.g., poor health, lack of support, or harmful habits). Improving your routine and life quality could enhance sustainability.";
            }
        }

        return advice;
    }

    @GetMapping("/")
    public ResponseEntity<Map<String,String>> home(){
        return ResponseEntity.ok(Map.of("message","Welcome to the Predictor-API"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> health(){
        RestTemplate restTemplate = new RestTemplate();
        String url = mlApiUrl + "health";
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCodeValue() == 200) {
                return ResponseEntity.ok(Map.of("status", "Service is healthy"));
            } else {
                return ResponseEntity.status(response.getStatusCode()).body(Map.of("status", "Service is not healthy"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("status", "Error contacting service"));
        }
    }

    @GetMapping("*")
    public ResponseEntity<Map<String,String>> fallback(){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error","endpoint not found"));
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String,Object>> predict(@RequestBody StudentInput input){

        // Validation
        /*
            If the user doesn't send:
            -Age
            -StudyTime(weekly)
            -G1 and G2 grades
            There will be no prediction.

            If any of the other inputs, are empty, they
            will be filled with values that are considered normal/average.
        */

        List<String> missingFields = new ArrayList<>();
        if (input.getAge() == null) missingFields.add("age");
        if (input.getStudytime() == null) missingFields.add("studytime");
        if (input.getG1() == null) missingFields.add("g1");
        if (input.getG2() == null) missingFields.add("g2");

        if (!missingFields.isEmpty()) {
            String missing = String.join(", ", missingFields);
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing required fields",
                    "error_detailed", missing + " are required"
            ));
        }


        if (input.getTraveltime() == null) input.setTraveltime(1);
        if (input.getFailures() == null) input.setFailures(0);
        if (input.getSchoolsup() == null) input.setSchoolsup(false);
        if (input.getFamsup() == null) input.setFamsup(false);
        if (input.getFamrel() == null) input.setFamrel(3);
        if (input.getFreetime() == null) input.setFreetime(3);
        if (input.getGoout() == null) input.setGoout(3);
        if (input.getDalc() == null) input.setDalc(1);
        if (input.getWalc() == null) input.setWalc(1);
        if (input.getHealth() == null) input.setHealth(3);
        if (input.getAbsences() == null) input.setAbsences(0);

        String schoolsupStr = input.getSchoolsup() ? "yes" : "no";
        String famsupStr = input.getFamsup() ? "yes" : "no";

        Map<String, Object> payload = new HashMap<>();
        payload.put("age", input.getAge());
        payload.put("traveltime", input.getTraveltime());
        payload.put("studytime", input.getStudytime());
        payload.put("failures", input.getFailures());
        payload.put("schoolsup", schoolsupStr);
        payload.put("famsup", famsupStr);
        payload.put("famrel", input.getFamrel());
        payload.put("freetime", input.getFreetime());
        payload.put("goout", input.getGoout());
        payload.put("Dalc", input.getDalc());
        payload.put("Walc", input.getWalc());
        payload.put("health", input.getHealth());
        payload.put("absences", input.getAbsences());
        payload.put("G1", input.getG1());
        payload.put("G2", input.getG2());

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        headers.set("X-Internal-Token", mlApiToken); // 🔐 Add the auth token

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(mlApiUrl + "predict", request, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "ML service failed"));
        }

        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("prediction")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Invalid response from ML service"));
        }


        Map<String,Object> prediction = (Map<String,Object>) body.get("prediction");

        double behaviorPrediction = ((Number) prediction.get("behavior_prediction")).doubleValue();
        double finalPrediction = ((Number) prediction.get("final_prediction")).doubleValue();
        double performancePrediction = ((Number) prediction.get("performance_prediction")).doubleValue();


        // BONUS, advices

        String advice = generateAdvice(behaviorPrediction,performancePrediction);

        return ResponseEntity.ok(Map.of(
                "behavior",behaviorPrediction,
                "performance",performancePrediction,
                "final",finalPrediction,
                "advice", advice
        ));
    }
}
