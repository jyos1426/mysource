package com.my.vo;
import java.io.Serializable;

public class Person implements Serializable {
	private static final long serialVersionUID = 7421685912565278401L;
	//동일 클래스로 사용할 수 있음
	
	private String name;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
