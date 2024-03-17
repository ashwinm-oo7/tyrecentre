package com.tyrecentre.constant;

import java.util.ArrayList;
import java.util.List;

public class Constant {

	
	public static String APPROVED_STR = "Approved";
	public static String REJECTED_STR = "Rejected";
	public static String INPROGRESS_STR = "In Progress";
	public static String SUCCESS_STR = "Success";
	public static String FAILED_TO_REPAIR_STR = "Failed To Repair";
	public static String SUGGESTED_FOR_NEW_TYRE_STR = "Suggested For New Tyre";
	public static String SUGGESTED_FOR_NEW_TUBE_STR = "Suggested For New Tube";
	
	
	public static List<String> getAllStatusStr(){
		List<String> statusList = new ArrayList<>();
		statusList.add(APPROVED_STR);
		statusList.add(REJECTED_STR);
		statusList.add(INPROGRESS_STR);
		statusList.add(SUCCESS_STR);
		statusList.add(FAILED_TO_REPAIR_STR);
		statusList.add(SUGGESTED_FOR_NEW_TYRE_STR);
		statusList.add(SUGGESTED_FOR_NEW_TUBE_STR);
		return statusList;
	}
}
