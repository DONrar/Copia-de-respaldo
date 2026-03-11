package org.example;

import org.example.modelmapper.dto.PersonCustomDTO;
import org.example.modelmapper.dto.PersonDefaultDTO;
import org.example.modelmapper.entity.Person;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

public class Main {

    /* Model Mapper - Default
    public static void main(String[] args) {
        ModelMapper modelMapper = new ModelMapper();

        Person person = new Person(1L, "Camilo", "Acosta", "acosta@email.com",(byte) 20, 'M');

        System.out.println(person);

        PersonDefaultDTO personDefaultDTO = modelMapper.map(person, PersonDefaultDTO.class);

        System.out.println(personDefaultDTO);
    }*/

    /* Model Mapper */
    public static void main(String[] args) {
        ModelMapper modelMapper = new ModelMapper();

        TypeMap<Person, PersonCustomDTO> propertyMapper = modelMapper.createTypeMap(Person.class, PersonCustomDTO.class);
        propertyMapper.addMapping(Person::getId, PersonCustomDTO::setIdDTO);
        propertyMapper.addMapping(Person::getName, PersonCustomDTO::setNameDTO);
        propertyMapper.addMapping(Person::getLastName, PersonCustomDTO::setLastNameDTO);
        propertyMapper.addMapping(Person::getEmail, PersonCustomDTO::setEmailDTO);
        propertyMapper.addMapping(Person::getGender, PersonCustomDTO::setGenderDTO);

        Person personEntity = new Person(1L, "Santiago", "Perez", "santy@mail.com", (byte) 25, 'M');
        System.out.println(personEntity);

        PersonCustomDTO personDTO = propertyMapper.map(personEntity);
        System.out.println(personDTO.toString());
    }
}