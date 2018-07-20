package com.my.vo;

public class OrderLine {
	/*
	 * LINE_INFO_NO LINE_PROD_NO LINE_QUANTITY
	 */

	private int line_info_no;
	// private String line_prod_no;
	private Product line_p;
	private int line_quantity;

	public OrderLine() {
		super();
	}

	public OrderLine(int line_info_no, Product line_p, int line_quantity) {
		super();
		this.line_info_no = line_info_no;
		this.line_p = line_p;
		this.line_quantity = line_quantity;
	}

	public int getLine_info_no() {
		return line_info_no;
	}

	public void setLine_info_no(int line_info_no) {
		this.line_info_no = line_info_no;
	}

	public Product getLine_p() {
		return line_p;
	}

	public void setLine_p(Product line_p) {
		this.line_p = line_p;
	}

	public int getLine_quantity() {
		return line_quantity;
	}

	public void setLine_quantity(int line_quantity) {
		this.line_quantity = line_quantity;
	}

	@Override
	public String toString() {
		return "OrderLine [line_info_no=" + line_info_no + ", line_p=" + line_p + ", line_quantity=" + line_quantity
				+ "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + line_info_no;
		result = prime * result + ((line_p == null) ? 0 : line_p.hashCode());
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
		OrderLine other = (OrderLine) obj;
		if (line_info_no != other.line_info_no)
			return false;
		if (line_p == null) {
			if (other.line_p != null)
				return false;
		} else if (!line_p.equals(other.line_p))
			return false;
		return true;
	}
}
