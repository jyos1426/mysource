package com.my.vo;

public class RepBoard {
	private int level;
	private int no;
	private int parent_no;
	private String subject;
	private String content;
	private String password;
	
	
	public RepBoard() {
		super();
	}
	public RepBoard(int level,int no, int parent_no, String subject, String content, String password) {
		super();
		this.level = level;
		this.no = no;
		this.parent_no = parent_no;
		this.subject = subject;
		this.content = content;
		this.password = password;
	}
	public RepBoard(int no, int parent_no, String subject, String content, String password) {
		super();
		this.no = no;
		this.parent_no = parent_no;
		this.subject = subject;
		this.content = content;
		this.password = password;
	}
	public RepBoard(int parent_no, String subject, String content, String password) {
		super();
		this.parent_no = parent_no;
		this.subject = subject;
		this.content = content;
		this.password = password;
	}
	public RepBoard(String subject, String content, String password) {
		super();
		this.subject = subject;
		this.content = content;
		this.password = password;
	}
	
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getNo() {
		return no;
	}
	public void setNo(int no) {
		this.no = no;
	}
	public int getParent_no() {
		return parent_no;
	}
	public void setParent_no(int parent_no) {
		this.parent_no = parent_no;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return no+"\t:\t"+parent_no+"\t:\t"+subject+"\t:\t"+content+"\t:\t"+password;
//		System.out.println(no+"\t:\t"+parentNo+"\t:\t"+subject+"\t:\t"+content+"\t:\t"+password);
	}
	
}