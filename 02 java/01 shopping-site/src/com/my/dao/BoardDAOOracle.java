package com.my.dao;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.my.vo.RepBoard;

@Repository
public class BoardDAOOracle {	
	@Autowired
	private SqlSession session;
	public BoardDAOOracle(){
	}	
	
	public List<RepBoard> selectAll() throws Exception {
		return session.selectList("BoardDAOMapper.selectAll");			
	}
	
	public List<RepBoard> selectByNo(int no){
		return session.selectList("BoardDAOMapper.selectByNo",no);			
	}
	
	public List<RepBoard> selectByCont(String cont){		
		return session.selectList("BoardDAOMapper.selectByCont",cont);	
	}
	
	public void insert(RepBoard board){
		session.insert("BoardDAOMapper.insert",board);
	}
	
	public void update(RepBoard board){
		session.update("BoardDAOMapper.update",board);
	}
	
	public void delete(int no){
		session.delete("BoardDAOMapper.delete",no);	
	}
	
	public boolean chkPassword(int no, String pwd){
		Map<String,Object> map = new HashMap<>();
        map.put("no", no);
        map.put("password", pwd);
        
        List<RepBoard> boardlist = session.selectList("BoardDAOMapper.chkpassword", map);
        
        if (boardlist.isEmpty()) 
        	 return false;         
        else return true;
	}
	
	public List<RepBoard> selectParents(){
		return session.selectList("BoardDAOMapper.selectParents");	
	}

}
