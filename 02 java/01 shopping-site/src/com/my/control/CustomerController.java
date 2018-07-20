package com.my.control;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.my.dao.CustomerDAO;
import com.my.vo.Customer;

@Controller
public class CustomerController {
	@Autowired
	private CustomerDAO dao;
		 
	@RequestMapping(value="/login.do", method=RequestMethod.POST)		
	public String login(String id, 
							@Param("pwd") String pwd, 
							HttpSession session,
							Model model){		
	     try {
		    session.removeAttribute("loginInfo");	 
		    System.out.println("로그인시도 : "+new Date()+" : "+id+" : "+pwd);
		    String result = "";
		    Customer c = dao.selectById(id);		    
		    System.out.println(c.getStatus());
		    if( null != c  && pwd.equals(c.getPassword()) && !c.getStatus().equals("d")){
	    		session.setAttribute("loginInfo",c);
				result = "1";
		    }else result = "-1";   
		    
		    model.addAttribute("result",result);	
		} catch (Exception e) {
			e.printStackTrace();
		}	    

	     String forwardURL="/result.jsp";	     
	     return forwardURL;
	}		
	
	@RequestMapping(value="/signup.do")
	public String signup(String id,
							@RequestParam("pwd") String pwd, 
							String name, Model model){		
	    String result = "0";
	    try {
			Customer c = new Customer(id, pwd, name);	
			dao.insert(c);		
			result = "1";
		 
		} catch (Exception e) {
			result = e.getMessage();
		}	  
	    model.addAttribute("result",result);	
	    String forwardURL="result.jsp";
		return forwardURL;
	}

	@RequestMapping(value="/dubchkid.do")
	public String dubChkId(String id, Model model) {
		try {
			String result = "0";
			Customer c = dao.selectById(id);
			if (null == c && !"".equals(id)) {
				result = "1";
			} else if ("".equals(id)) {
				result = "-1";
			} else {
				result = "-2";
			}

			System.out.println(result);
			model.addAttribute("result", result);
		} catch (Exception e) {
			e.printStackTrace();
		}

		String forwardURL = "/result.jsp";
		return forwardURL;
	}

	@RequestMapping(value="/logout.do", method=RequestMethod.POST)
	public String logout(HttpServletRequest request,
						HttpSession session, 
						Model model){
		session.removeAttribute("loginInfo");	//세션에서 loginInfo속성삭제
		model.addAttribute("result",request.getContextPath());			
		String forwardURL="/result.jsp";
		return forwardURL;
	}
	
	@RequestMapping("/customerdetail.do")
	public String customerdetail(HttpServletRequest request,
									HttpSession session, 
									Model model){
		Customer c = (Customer)session.getAttribute("loginInfo");
		model.addAttribute("result",c);			
		String forwardURL="/result_customer_detail.jsp";
		return forwardURL;
	}
	
	@RequestMapping("/customerdelete.do")
	public String customerdelete(HttpServletRequest request, HttpSession session, 
								String id,
								@RequestParam("pwd") String pwd, 
								String name, Model model){
		 Customer c = null;
		 try {
			 	c = new Customer(id, pwd, name);
				 System.out.println(c);
				dao.delete(id);		
			 
			} catch (Exception e) {
				e.getMessage();
			}	  
		 	session.removeAttribute("loginInfo");	//세션에서 loginInfo속성삭제
		 	model.addAttribute("result",request.getContextPath());			
			String forwardURL="/result.jsp";
			return forwardURL;
	}
	
	@RequestMapping("/customermodify.do")
	public String customermodify(HttpSession session, String id,
								@RequestParam("pwd") String pwd, 
								String name, Model model){
			Customer c = null;
		 try {
			 	c = new Customer(id, pwd, name);
				dao.update(c);	
				session.setAttribute("loginInfo",c);		 
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}	  
		 	model.addAttribute("result",c);	
		    String forwardURL="/result_customer_detail.jsp";
			return forwardURL;
	}
}
