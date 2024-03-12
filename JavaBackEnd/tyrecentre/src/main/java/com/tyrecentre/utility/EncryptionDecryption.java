package com.tyrecentre.utility;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@PropertySource("classpath:/tyrecentre.properties")
@Component
public class EncryptionDecryption {

	@Autowired
	Environment env;
	
	static String initVector;
	static String key;

	public EncryptionDecryption(Environment env) {
		initVector 			= env.getProperty("INITVECTOR");
		key					= env.getProperty("KEY_ENC_DEC");
	}

	public static String encrypt(String valueStr) {
		String encodedData = null;
		try {
			
			IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

			byte[] encrypted = cipher.doFinal(valueStr.getBytes());
			encodedData = new String(Base64.getEncoder().encode(encrypted));
			return encodedData;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			encodedData = null;
		}
		return encodedData;
	}

	public static String decrypt(String valueStr) {
		String decodedData = null;
		try {

			IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

			byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(valueStr));
			decodedData = new String(decrypted);
			return decodedData;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			decodedData = null;
		}
		return decodedData;
	}
}
