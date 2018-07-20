package com.my.vo;

@SuppressWarnings("serial")
public class Customer extends Person{
	private String id;
	private transient String password; 
	private String status;
	
	
	//Ctrl + shift + S
	public Customer() {
	}
	
	public Customer(String id, String password, String name) {
		this.id = id;
		this.password = password;
		this.setName(name);
	}
	public Customer(String id, String password, String name, String status) {
		this.id = id;
		this.password = password;
		this.setName(name);
		this.status = status;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getStatus() {
		if (null==status)
			status = "pass";
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "id="+id+"&password="+password+"&name="+this.getName();
	}
	


}
