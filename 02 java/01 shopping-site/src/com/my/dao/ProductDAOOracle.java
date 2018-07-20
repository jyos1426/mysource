package com.my.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Repository;

import com.my.vo.Product;

@Repository
public class ProductDAOOracle implements ProductDAO {
	@Autowired
	private SqlSession session;
	
	@Override
	public void insert(Product p) throws Exception {
		try{						
			session.insert("ProductDAOMapper.insert",p);
		}catch(DuplicateKeyException e){
	        throw new Exception("이미 존재하는 번호입니다.");
	    }catch(BadSqlGrammarException e){
		   throw new Exception("SQL구문 오류!");
	    }catch(Exception e){
			e.printStackTrace();
		}
	}

	@Override
	public List<Product> selectAll() throws Exception {
		List<Product> list = null;
		try{
			list = session.selectList("ProductDAOMapper.selectAll");				
		}catch(Exception e){
			throw e;
		}
		return list;
	}

	@Override
	public Product selectByNo(String no) throws Exception {
		Product p = null;
		try{
			p = session.selectOne("ProductDAOMapper.selectByNo",no);				
		}catch(Exception e){
			throw e;
		}
		return p;
	}

	@Override
	public List<Product> selectByName(String word) throws Exception {
		List<Product> list = null;
		try{
			list = session.selectList("ProductDAOMapper.selectByName",word);				
		}catch(Exception e){
			throw e;
		}
		return list;
	}
}
