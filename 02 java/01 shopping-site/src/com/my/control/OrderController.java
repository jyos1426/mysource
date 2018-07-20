package com.my.control;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.my.dao.OrderDAOOracle;
import com.my.vo.Customer;
import com.my.vo.OrderInfo;
import com.my.vo.OrderLine;
import com.my.vo.Product;

@Controller
public class OrderController {
	@Autowired
	private OrderDAOOracle dao;
	
	@RequestMapping("/addorder.do")
	public String add(HttpServletRequest request, HttpSession session, Model model){
		Customer c = (Customer)session.getAttribute("loginInfo");	//세션에서 loginInfo속성삭제
		String forwardURL="";
		boolean issaved = true;
		
		if(null==c){	//비로그인
			forwardURL="loginform.jsp";
		}else{			//로그인					
			HashMap<Product,Integer> cart= (HashMap<Product,Integer>)session.getAttribute("cart");
			Set<Product> products = cart.keySet();			
			List<OrderLine> lines= new ArrayList<>();

			for(Product p: products){
				int q = cart.get(p);
				lines.add(new OrderLine(1,p,q));
			}
			OrderInfo orderinfo= new OrderInfo(0,new Date(),c,lines);
			try {
				dao.insert(orderinfo);
			} catch (Exception e) {
				issaved = false;
				e.printStackTrace();				
			}
		}//end if
		if(issaved){
			session.removeAttribute("cart");
		}
		model.addAttribute("result",request.getContextPath());	
		forwardURL="orderlist.do";
		return forwardURL;
	}
	
	@RequestMapping("/orderlist.do")
	public String execute(HttpSession session , Model model){
		Customer c = (Customer)session.getAttribute("loginInfo");	//세션에서 loginInfo속성삭제		
		String forwardURL="";	
		List<OrderInfo> info = null;
		
		if( null == c ){	//비로그인
			forwardURL="loginform.jsp";
		}else{			//로그인			
			info= dao.selectById(c.getId());
			forwardURL="result_orderlist.jsp";
		}//end if
		
		model.addAttribute("result",info);	
		return forwardURL;
	}
}
