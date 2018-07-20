package com.my.control;

import java.util.HashMap;
import java.util.Set;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.my.vo.Product;

@Controller
public class CartController {
	
	@RequestMapping("/addcart.do")
	public String add(HttpSession session,String no,String name,
			@RequestParam("price") int price,int quantity){
		   
		   Product p = new Product(no,name,price);	
		   HashMap<Product,Integer> cart = (HashMap)session.getAttribute("cart");
		   if(null == cart){
			   cart = new HashMap<Product,Integer>();
			   session.setAttribute("cart", cart);			   
		   }
		   
		   Integer inCartQuantity = cart.get(p);
		   if(null == inCartQuantity){
		   }else{
			   quantity += inCartQuantity;
		   }
		   cart.put(p, quantity);
		   
		   System.out.println("장바구니 내용");
		   Set<Product> products = cart.keySet();
		   
		   for(Product inCartProduct: products){
			   int q = cart.get(inCartProduct);
			   System.out.println(inCartProduct.getNo()+" : "+inCartProduct.getName() +" : "+ q);
		   }		   
		return "result_productlist.jsp";
	}
	
	@RequestMapping("/cartlist.do")
	public String execute(){
		String forwardURL="result_cartlist.jsp";
		return forwardURL;
	}
}
