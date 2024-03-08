package com.tyrecentre.utility;

import java.io.Serializable;

//~--- JDK imports ------------------------------------------------------------

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;

public class ValueObject implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;


	private transient Map<Object, Object>	htData	= new HashMap<>();

	public ValueObject() {
	}

	/**
	 * Declare new Value object with reference of hashmap
	 *
	 * @param object
	 */
	public ValueObject(Map<Object, Object> object) {
		htData = object;
	}

	/**
	 * Put data into hashmap if key or value can not be null
	 *
	 * @param paramName
	 * @param object
	 * @throws Exception 
	 */
	public void put(Object paramName, Object object) throws Exception {
		try {
			if ((paramName != null) && (object != null)) {
				htData.put(paramName, object);
			}
		} catch (Exception e) {
			throw e;
		}
	}

	/*
	 * Get data from hashmap
	 */
	public Object get(Object paramName) throws Exception {
		Object returnValue = null;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				returnValue = htData.get(paramName);
			}
			
			return returnValue;
		} catch (Exception e) {
			throw e;
		} 
	}
	
	/*
	 * Get data from hashmap
	 */
	public Object get(Object paramName, String defaultValue) throws Exception {
		Object returnValue = null;
		
		try {
			if (checkExistanceInVO(paramName)) {
				returnValue = htData.get(paramName);
			} else {
				return defaultValue;
			}
			
			return returnValue;
		} catch (Exception e) {
			return  null;
		} 
	}

	/**
	 * get long converted data if exception then 0 will return
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public long getLong(Object paramName) throws Exception {
		long	value	= 0;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value = Long.parseLong(htData.get(paramName).toString());
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} 
	}

	/**
	 * get long converted data if exception then default value
	 * @param paramName
	 * @param defaultValue
	 * @return
	 */
	public long getLong(Object paramName, long defaultValue) {
		long	value	= 0;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value = Long.parseLong(htData.get(paramName).toString());
			} else {
				return defaultValue;
			}
			
			return value;
		} catch (NumberFormatException e) {
			return defaultValue;
		} catch (Exception e) {
			return defaultValue;
		}
	}

	/**
	 * get int converted data if exception then 0 will return
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public int getInt(Object paramName) throws Exception {
		int	value	= 0;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value = Integer.parseInt(htData.get(paramName).toString());
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} finally {
			value	= 0;
		}
	}

	/**
	 * get int converted data if exception then default value
	 * @param paramName
	 * @param defaultValue
	 * @return
	 */
	public int getInt(Object paramName, int defaultValue) {
		int	value	= 0;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value = Integer.parseInt(htData.get(paramName).toString());
			} else {
				return defaultValue;
			}
			
			return value;
		} catch (NumberFormatException e) {
			return defaultValue;
		} catch (Exception e) {
			return defaultValue;
		} 
	}

	/**
	 * get short converted data if exception then 0 will return
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public short getShort(Object paramName) throws Exception {
		short	value	= 0;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value = Short.parseShort(htData.get(paramName).toString());
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} 
	}

	/**
	 * get short converted data if exception then default value
	 * @param paramName
	 * @param defaultValue
	 * @return
	 */
	public short getShort(Object paramName, short defaultValue) {
		short	value	= 0;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value = Short.parseShort(htData.get(paramName).toString());
			} else {
				return defaultValue;
			}
			
			return value;
		} catch (NumberFormatException e) {
			return defaultValue;
		} catch (Exception e) {
			return defaultValue;
		} 
	}

	/**
	 * get double converted data if exception then 0 will return
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public double getDouble(Object paramName) throws Exception {
		double	value	= 0;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value = Double.parseDouble(htData.get(paramName).toString());
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} 
	}

	/**
	 * get double converted data if exception then default value
	 * @param paramName
	 * @param defaultValue
	 * @return
	 */
	public double getDouble(Object paramName, double defaultValue) {
		double	value	= 0;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value = Double.parseDouble(htData.get(paramName).toString());
			} else {
				return defaultValue;
			}
			
			return value;
		} catch (NumberFormatException e) {
			return defaultValue;
		} catch (Exception e) {
			return defaultValue;
		} 
	}

	/**
	 * get boolean converted data if exception then false will return
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public boolean getBoolean(Object paramName) throws Exception {
		boolean	value	= false;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value = Boolean.parseBoolean(htData.get(paramName).toString());
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} 
	}

	/**
	 * get boolean converted data if exception then default value
	 * @param paramName
	 * @param defaultValue
	 * @return
	 */
	public boolean getBoolean(Object paramName, boolean defaultValue) {
		boolean	value	= false;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value = Boolean.parseBoolean(htData.get(paramName).toString());
			} else {
				return defaultValue;
			}
			return value;
		} catch (Exception e) {
			return defaultValue;
		} 
	}

	/**
	 * get Object converted data if exception then null will return
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public String getString(Object paramName) throws Exception {
		String	value	= null;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value = htData.get(paramName).toString();
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} 
	}
	
	public String getStringWithUpperCase(Object paramName) throws Exception {
		String	value	= null;
		
		try {
			if (paramName != null && htData.containsKey(paramName)) {
				value 	= htData.get(paramName).toString().toUpperCase();
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		}
	}
	
	public String getStringWithUpperCase(Object paramName, String defaultValue) throws Exception {
		String	value	= null;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value 	= htData.get(paramName).toString().toUpperCase();
			} else {
				return defaultValue;
			}
			
			return value;
		} catch (Exception e) {
			throw e;
		} 
	}

	/**
	 * get string converted data if exception then default value
	 * @param paramName
	 * @param defaultValue
	 * @return
	 */
	public String getString(Object paramName, String defaultValue) {
		String	value	= null;
		
		try {
			if (checkExistanceInVO(paramName)) {
				value = htData.get(paramName).toString();
			} else {
				return defaultValue;
			}
			
			return value;
		} catch (Exception e) {
			return defaultValue;
		} 
	}

	/**
	 * check if value object contains key
	 * @param paramName
	 * @return
	 * @throws Exception 
	 */
	public boolean containsKey(Object paramName) throws Exception {
		boolean		returnValue	= false;
		
		try {
			if (paramName != null) {
				returnValue	= htData.containsKey(paramName);
			}
			
			return returnValue;
		} catch (Exception e) {
			throw e;
		} 
	}

	/**
	 * return value object key set
	 * @return
	 */
	public Set<Object> keySet() {
		return htData.keySet();
	}

	/**
	 * check if value object is empty
	 * @return
	 */
	public Boolean isEmpty() {
		return htData.isEmpty();
	}

	/**
	 * clear data within hashmap
	 */
	public void clear() {
		htData.clear();
	}

	/**
	 * remove key from hashmap
	 * @param paramName
	 */
	public void remove(Object paramName) {
		htData.remove(paramName);
	}

	/**
	 * Add one object data to another
	 * @param object
	 */
	public void putAll(ValueObject object) {
		htData.putAll(object.getHtData());
	}

	/**
	 *
	 * @return
	 */
	public HashMap<Object, Object> getHtData() {
		return (HashMap<Object, Object>) htData;
	}

	/**
	 *
	 * @param htData
	 */
	public void setHtData(HashMap<Object, Object> htData) {
		this.htData = htData;
	}

	@Override
	public String toString() {
		return htData.toString();
	}

	public int size() {
		return htData.size();
	}
	
	public boolean checkExistanceInVO(Object key) throws Exception {
		boolean 	exist	= false;
		
		try {
			
			if(key != null && htData.containsKey(key) && htData.get(key) != null) {
				String str	= htData.get(key).toString();
				
				if(!str.equals("") && !str.isEmpty() && !str.equals("null") && !str.equals("undefined")) {
					exist		= true;
				}
			}
			
			return exist;
		} catch (Exception e) {
			throw e;
		} 
	}
	
	public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
		Map<Object, Boolean> uniqueMap = new ConcurrentHashMap<>();
		return t -> uniqueMap.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
	}
}