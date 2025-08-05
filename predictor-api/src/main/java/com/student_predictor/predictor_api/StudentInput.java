package com.student_predictor.predictor_api;

public class StudentInput {
    private Integer age;
    private Integer traveltime;
    private Integer studytime;
    private Integer failures;
    private Boolean schoolsup;
    private Boolean famsup;
    private Integer famrel;
    private Integer freetime;
    private Integer goout;
    private Integer Dalc;
    private Integer Walc;
    private Integer health;
    private Integer absences;
    private Double g1;
    private Double g2;

    // Default constructor
    public StudentInput() {
    }

    // Full constructor
    public StudentInput(Integer age, Integer traveltime, Integer studytime, Integer failures,
                        Boolean schoolsup, Boolean famsup, Integer famrel, Integer freetime,
                        Integer goout, Integer Dalc, Integer Walc, Integer health,
                        Integer absences, Double g1, Double g2) {
        this.age = age;
        this.traveltime = traveltime;
        this.studytime = studytime;
        this.failures = failures;
        this.schoolsup = schoolsup;
        this.famsup = famsup;
        this.famrel = famrel;
        this.freetime = freetime;
        this.goout = goout;
        this.Dalc = Dalc;
        this.Walc = Walc;
        this.health = health;
        this.absences = absences;
        this.g1 = g1;
        this.g2 = g2;

    }

    // Getters and Setters

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Integer getTraveltime() { return traveltime; }
    public void setTraveltime(Integer traveltime) { this.traveltime = traveltime; }

    public Integer getStudytime() { return studytime; }
    public void setStudytime(Integer studytime) { this.studytime = studytime; }

    public Integer getFailures() { return failures; }
    public void setFailures(Integer failures) { this.failures = failures; }

    public Boolean getSchoolsup() { return schoolsup; }
    public void setSchoolsup(Boolean schoolsup) { this.schoolsup = schoolsup; }

    public Boolean getFamsup() { return famsup; }
    public void setFamsup(Boolean famsup) { this.famsup = famsup; }

    public Integer getFamrel() { return famrel; }
    public void setFamrel(Integer famrel) { this.famrel = famrel; }

    public Integer getFreetime() { return freetime; }
    public void setFreetime(Integer freetime) { this.freetime = freetime; }

    public Integer getGoout() { return goout; }
    public void setGoout(Integer goout) { this.goout = goout; }

    public Integer getDalc() { return Dalc; }
    public void setDalc(Integer dalc) { this.Dalc = dalc; }

    public Integer getWalc() { return Walc; }
    public void setWalc(Integer walc) { this.Walc = walc; }

    public Integer getHealth() { return health; }
    public void setHealth(Integer health) { this.health = health; }

    public Integer getAbsences() { return absences; }
    public void setAbsences(Integer absences) { this.absences = absences; }

    public Double getG1() { return g1; }
    public void setG1(Double g1) { this.g1 = g1; }

    public Double getG2() { return g2; }
    public void setG2(Double g2) { this.g2 = g2; }
}
