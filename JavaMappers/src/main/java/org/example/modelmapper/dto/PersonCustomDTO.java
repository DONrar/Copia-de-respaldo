package org.example.modelmapper.dto;

public class PersonCustomDTO {
    private Long idDTO;
    private String nameDTO;
    private String lastnameDTO;
    private String email;
    private byte age;
    private  Character gender;

    
    public Long getIdDTO() {
        return idDTO;
    }

    public void setIdDTO(Long idDTO) {
        this.idDTO = idDTO;
    }

    public String getNameDTO() {
        return nameDTO;
    }

    public void setNameDTO(String nameDTO) {
        this.nameDTO = nameDTO;
    }

    public String getLastnameDTO() {
        return lastnameDTO;
    }

    public void setLastNameDTO(String lastnameDTO) {
        this.lastnameDTO = lastnameDTO;
    }

    public String getEmail() {
        return email;
    }

    public void setEmailDTO(String email) {
        this.email = email;
    }

    public byte getAge() {
        return age;
    }

    public void setAge(byte age) {
        this.age = age;
    }

    public Character getGender() {
        return gender;
    }

    public void setGenderDTO(Character gender) {
        this.gender = gender;
    }

    @Override
    public String toString() {
        return "PersonCustomDTO{" +
                "idDTO=" + idDTO +
                ", nameDTO='" + nameDTO + '\'' +
                ", lastnameDTO='" + lastnameDTO + '\'' +
                ", email='" + email + '\'' +
                ", age=" + age +
                ", gender=" + gender +
                '}';
    }
}
