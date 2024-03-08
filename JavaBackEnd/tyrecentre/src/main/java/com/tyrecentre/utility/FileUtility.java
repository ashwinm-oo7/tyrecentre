package com.tyrecentre.utility;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Base64;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

public class FileUtility {
	
	//private static final Logger logger = LoggerFactory.getLogger(FileUtility.class);
	public static final String TRACE_ID	= FileUtility.class.getName();

	public static final String FILE_EXTENSION_JPG	= ".webp";
	public static final String EXCEL_EXTENSION		= ".xlsx";
	public static final String PATH_DELIMITER		= "\\";
	public static final String IMAGE_DELIMITER		= "data:image/webp"+";base64,";
	public static final String EXCEL_DELIMITER		= "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
	
	public static String saveBase64Image(String encodedString,String path,long id,String fileNameWithExtension) throws IOException {
		String image 			= null;
		byte[] decodedBytes 	= null;
		String imagePath 		= null;
		File file				= null;
		try {
			image 					= encodedString.substring(encodedString.indexOf(',') + 1);
			
			imagePath = path+id;
			file = new File(imagePath);
			if(!file.exists()) {
				file.mkdirs();
			}
			imagePath = imagePath + fileNameWithExtension;
			file = new File(imagePath);
			
			decodedBytes = Base64.getDecoder().decode(image);
			FileUtils.writeByteArrayToFile(file, decodedBytes);
				
			return imagePath;
		} catch (IOException e) {
			throw e;
		}
	}
	
	public static String saveBase64ImageByName(String encodedString,String path,String fileName) throws IOException {
		String image 			= null;
		byte[] decodedBytes 	= null;
		String imagePath 		= null;
		File file				= null;
		try {
			image 					= encodedString.substring(encodedString.indexOf(',') + 1);
			
			imagePath = path;
			file = new File(imagePath);
			if(!file.exists()) {
				file.mkdirs();
			}
			imagePath = imagePath  + fileName + FILE_EXTENSION_JPG;
			file = new File(imagePath);
			System.out.println("file path "+imagePath);
			
			decodedBytes = Base64.getDecoder().decode(image);
			FileUtils.writeByteArrayToFile(file, decodedBytes);
			return imagePath;
		} catch (IOException e) {
			throw e;
		}
	}
	
	public static String saveBase64FileByName(String encodedString,String path,String fileName , String fileExtension) throws IOException {
		String image 			= null;
		byte[] decodedBytes 	= null;
		String imagePath 		= null;
		File file				= null;
		try {
			image 					= encodedString.substring(encodedString.indexOf(',') + 1);
			
			imagePath = path;
			file = new File(imagePath);
			if(!file.exists()) {
				file.mkdirs();
			}
			imagePath = imagePath + fileName + "." + fileExtension;
			file = new File(imagePath);
			
			decodedBytes = Base64.getDecoder().decode(image);
			FileUtils.writeByteArrayToFile(file, decodedBytes);
				
			return imagePath;
		} catch (IOException e) {
			throw e;
		}finally {
			 image 			= null; 
			 decodedBytes 	= null; 
			 imagePath 		= null; 
			 file			= null; 
		}
	}
	
	public static String getBase64Image(String filePath) throws  IOException{
		String imageString 			= null;
		File file					= null;
		byte[] fileContent 			= null;
		String encodedString		= null;
		try {
			file = new File(filePath);
			if(file.exists()) {
				fileContent 	= FileUtils.readFileToByteArray(file);
				encodedString 	= Base64.getEncoder().encodeToString(fileContent);
				imageString 	= IMAGE_DELIMITER + encodedString;
			}
			
			return imageString;
		} catch (IOException e) {
			throw e;
		}
	}
	
	public static ValueObject saveImageFile(MultipartFile file,long id,String userProfileImagePath,String imageName) throws Exception  {
		File 				convertfile 			= null;
		FileOutputStream 	fileOutputStream 		= null;
		String 				userProfilePath			= null;
		ValueObject  		valueObject				= null;
		boolean 			createNewFile			= false;
		try {
				valueObject			= new ValueObject();
				userProfilePath 	= userProfileImagePath + id;
				
				convertfile 		= new File(userProfilePath);
				
				if(!convertfile.exists()) {
					 convertfile.mkdirs();
				}
				userProfilePath = userProfilePath + imageName;
				convertfile 	= new File(userProfilePath);
				createNewFile = convertfile.createNewFile();
				if(createNewFile) {}
				
				fileOutputStream = new FileOutputStream(convertfile);
				fileOutputStream.write(file.getBytes());
				
				valueObject.put("filePath", userProfilePath);
			return valueObject;
		}catch (Exception e) {
			throw e;
		}finally {
			if(fileOutputStream != null ) {
				fileOutputStream.close();
			}
		}
	}
	
	public static String getImageFile(long id,String userProfileImagePath) throws IOException  {
		File 				convertfile 			= null;
		File 				convertfile2 			= null;
		String 				userProfilePath			= null;
		String 				imageString				= null;
		String 				extension 				= null;
		String 				extension1 				= null;
		FileInputStream fileInputStream 			= null;
		byte[]			imageByte			= null;
		try {
			userProfilePath = userProfileImagePath+id;
			
			convertfile 	= new File(userProfilePath);
			
			if(convertfile.listFiles().length > 0) {
				convertfile2 = convertfile.listFiles()[0];
				
				if(convertfile2 != null && !convertfile2.isDirectory()) {
						 extension 			= FilenameUtils.getExtension(convertfile2.getName());
						 fileInputStream 	= new FileInputStream(convertfile2);
						 imageByte 			= new byte[(int)convertfile2.length()];
						 
						 if(imageByte.length > 0) {
							 fileInputStream.read(imageByte);
							 extension1 	= Base64.getEncoder().encodeToString(imageByte);
							 imageString 	="data:image/"+extension+";base64,"+extension1;
						 }
						 
				}
			}
			
			return imageString;
		}catch (IOException e) {
			throw e;
		}finally {
			if(fileInputStream != null) {
				fileInputStream.close();
			}
		}
	}

	public static boolean isExist(String file) throws IOException {
		boolean isExist =true;
		try {

			if (FileUtility.class.getClassLoader().getResourceAsStream(file) == null) {
				isExist = false;
			}

			return isExist;
		} catch (Exception e) {
			throw e;
		}
	}
	
	public static String readFileTemp(String fileName)throws Exception {
		String			content 	= null;
		byte[] 			fileContent = null;
		
		try {
			
			fileContent = FileUtils.readFileToByteArray(new File(fileName));
			String encodedString = Base64.getEncoder().encodeToString(fileContent);
			content = encodedString != null ?  IMAGE_DELIMITER  + encodedString : "";
		
			return content;
		 } catch (Exception e) {
			throw e;
		 } 
	}
	
	public static String readFile(String fileName) throws Exception {
		String			content = null;
		InputStream		in 		= null;
		
		 try {

			 if(isExist(fileName)) { 
				 in = PropertiesUtils.class.getClassLoader().getResourceAsStream(fileName);
					
					if(in == null) {
						in = PropertiesUtils.class.getResourceAsStream(fileName);
					}
					
					if(in != null) {
						content = read(in);
						content = content.trim();
					}
			 }
			 
			 return content;
		 } catch (Exception e) {
			 throw e;
		 } 
	}
	
	public static String read(InputStream input) throws IOException {
        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(input))) {
            return buffer.lines().collect(Collectors.joining(""));
        }
    }
	
	public static ValueObject saveExcelFile(MultipartFile file,String filePath) throws Exception{
		 File 				fileConvrter 		= null;
		 byte[] 			decodedBytes 		= null;
		 FileOutputStream 	fileOutputStream 	= null;
		 ValueObject 		valueOutObject		= null;
		 try {
				valueOutObject = new ValueObject();
			 	fileConvrter = new File(filePath);
				
			 	if(!fileConvrter.exists()) {
					fileConvrter.mkdirs();
				}
			 	 
			 	 filePath 		= filePath+file.getOriginalFilename();
			 	 
			 	 fileConvrter    = null;
			 	 fileConvrter 	 = new File(filePath);
				 
				 
				 if(fileConvrter.exists()) { 
					 valueOutObject.put("message", "File Name Already Exists, Please Rename File");
					 return valueOutObject;
				 }
				
				 decodedBytes 		= file.getBytes();
				 fileOutputStream 	= new FileOutputStream(fileConvrter);
				 
				 fileOutputStream.write(decodedBytes);
				 valueOutObject.put("FilePath", filePath);
				 return valueOutObject;
				 
		} catch (Exception e) {
			//logger.error("Exception Occured while saving  ExcelFile");
			throw e;
		}finally {
			if(fileOutputStream  != null) {
				fileOutputStream.close();
			}
			
			fileConvrter 		= null; 
			decodedBytes 		= null; 
			fileOutputStream 	= null; 
		}
	}
	
	 public static void deleteFile(String filePath) throws IOException{
		 try {
			 
			 if(FileUtils.getFile(filePath).exists()) {
				 FileUtils.forceDelete(FileUtils.getFile(filePath));
			 }
			 
		 } catch (IOException e) {
			// logger.error(e.getMessage());
		 }finally {
			 
		 }
	 }
	 public static String saveBase64File(String encodedString,String path,String fileName , String fileExtension) throws IOException {
			String image 			= null;
			byte[] decodedBytes 	= null;
			String imagePath 		= null;
			File file				= null;
			try {
				image 					= encodedString.substring(encodedString.indexOf(',') + 1);
				
				imagePath = path;
				file = new File(imagePath);
				if(!file.exists()) {
					file.mkdirs();
				}
				imagePath = imagePath + fileName + "." + fileExtension;
				file = new File(imagePath);
				
				decodedBytes = Base64.getDecoder().decode(image);
				FileUtils.writeByteArrayToFile(file, decodedBytes);
					
				return imagePath;
			} catch (Exception e) {
				throw e;
			}finally {
				 image 			= null; 
				 decodedBytes 	= null; 
				 imagePath 		= null; 
				 file			= null; 
			}
		}	
}
