package com.my.dao;
import java.util.List;
import com.my.vo.Product;

public interface ProductDAO {
	/**
	 * 저장하려는 product 객체의 id가 저장소에 이미 존재하는 경우
	 * "이미 존재하는 아이디입니다"msg를 출력하고 저장안함.
	 * @param c
	 */
	public void insert(Product p) throws Exception;	
	/**
	 * 전체 제품을 반환한다.
	 * @return
	 */
	public List<Product> selectAll() throws Exception;
	
	/**
	 * No에 해당하는 제품을 반환한다
	 * @param no no값
	 * @return 저장소의 제품객체를 반환한다.
	 *        제품을 찾지 못하면 null을 반환한다.
	 */
	public Product selectByNo(String no) throws Exception;
	/**
	 * 이름에 해당하는 제품을 반환한다
	 * @param name 이름
	 * @return
	 */
	public List<Product> selectByName(String word) throws Exception;
}
