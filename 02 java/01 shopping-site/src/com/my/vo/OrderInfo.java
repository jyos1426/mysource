package com.my.vo;

import java.util.Date;
import java.util.List;

public class OrderInfo {
	/*
	 * INFO_NO INFO_DATE INFO_ID
	 */
	private int info_no;
	private Date info_date;
	// java.sql.Date 는 util의 자식임, 그래서 DB와 일하는것밖에 못함
	// 그래서 좀더 일반화 된 부모타입의 util.Date를 쓸 것
	// private String info_id;
	// DB에서 테이블간 관계가 있다면, 객체지향에서 class간의 관계로 바껴야함
	private Customer info_c;
	private List<OrderLine> lines;
	// 하나의 기본정보에 여러가지 상세정보가 있을 때

	public OrderInfo() {
		super();
	}

	public OrderInfo(int info_no, Date info_date, Customer info_c, List<OrderLine> lines) {
		super();
		this.info_no = info_no;
		this.info_date = info_date;
		this.info_c = info_c;
		this.lines = lines;
	}

	public int getInfo_no() {
		return info_no;
	}

	public void setInfo_no(int info_no) {
		this.info_no = info_no;
	}

	public Date getInfo_date() {
		return info_date;
	}

	public void setInfo_date(Date info_date) {
		this.info_date = info_date;
	}

	public Customer getInfo_c() {
		return info_c;
	}

	public void setInfo_c(Customer info_c) {
		this.info_c = info_c;
	}

	public List<OrderLine> getLines() {
		return lines;
	}

	public void setLines(List<OrderLine> lines) {
		this.lines = lines;
	}

	@Override
	public String toString() {
		return "OrderInfo [info_no=" + info_no + ", info_date=" + info_date + ", info_c=" + info_c + ", lines=" + lines
				+ "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + info_no;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OrderInfo other = (OrderInfo) obj;
		if (info_no != other.info_no)
			return false;
		return true;
	}

}
