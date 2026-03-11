package org.example;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Properties;

public class StoreProperties {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.put("name", "camilo");
        properties.put("version", "1.0");
        properties.put("age", "25");


        try {
            //Exportar propiedades en XML
            OutputStream os = new FileOutputStream("src/main/resources/application.xml");
            properties.storeToXML(os, "descripcion");
        }catch (Exception e) {
            throw new RuntimeException(e);
        }

        try{
            //Exportar propiedas a archivos .properties
            OutputStream out = new FileOutputStream("src/main/resources/application.properties");
            properties.store(out, "descripcion .properties");
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}