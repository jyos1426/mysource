package com.my.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.my.vo.OrderInfo;
import com.my.vo.OrderLine;

@Repository
public class OrderDAOOracle {
	@Autowired
	private SqlSession session;	
	
	@Transactional(propagation=Propagation.REQUIRED) 
	public void insert(OrderInfo info) throws Exception{				
		insertInfo(info);
		insertLine(info);	
	}
	
	public void insertInfo(OrderInfo info) {
		session.insert("OrderDAOMapper.insertInfo",info);
	}

	public void insertLine(OrderInfo info) throws Exception {
		List<OrderLine> lines = info.getLines();
		for (OrderLine line : lines) {
			session.insert("OrderDAOMapper.insertLine",line);
		}
	}

	/**
	 * 전체 주문목록을 반환
	 * 
	 * @return
	 */
	public List<OrderInfo> selectAll() {
		return session.selectList("OrderDAOMapper.selectAll");	
	}

	/**
	 * 주문자에 해당 주문목록 반환
	 * 
	 * @param id(주문자)
	 * @return
	 */
	public List<OrderInfo> selectById(String id) {		
		return session.selectList("OrderDAOMapper.selectById", id);			
	}

	/**
	 * 주문번호로 해당 주문정보를 반환
	 * 
	 * @param info_no
	 * @return
	 */
	public OrderInfo selectByNo(int info_no) {
		return null;
	}

	/**
	 * 상품번호에 해당하는 주문목록을 반환
	 * 
	 * @param prod_no
	 * @return
	 */
	public List<OrderInfo> selectByProdNo(String prod_no) {
		return null;
	}

	public List<OrderInfo> selectByDate(String frDate, String toDate) {
		return null;
	}

}// 일처리할 때 주문 기본과 상세 정보는 한 트랜젝션에서 관리
