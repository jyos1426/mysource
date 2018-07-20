package com.my.control;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.dao.ProductDAO;
import com.my.vo.Customer;
import com.my.vo.Product;

@Controller
public class ProductController {
	@Autowired
	private ProductDAO dao;
	
	@RequestMapping("/productlist.do")
	public String productlist(@RequestParam(required=false,defaultValue="no") String searchItem, 
							 	@RequestParam(required=false,defaultValue="")String searchValue, 
								Model model){	
		List<Product> list = new ArrayList<>();
		System.out.println("상품검색됨/ "+searchItem+" : "+searchValue);
		
		try {
			if("name".equals(searchItem) && !"".equals(searchValue)){
				list = dao.selectByName(searchValue);	
			}else if("no".equals(searchItem) && !"".equals(searchValue)){
				Product p = dao.selectByNo(searchValue);	
				if(p!=null){
					list.add(p);	
				}
			}else{
				list = dao.selectAll();		
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		model.addAttribute("result",list);		
		String forwardURL="result_productlist.jsp";
		return forwardURL;
	}
	
	@RequestMapping("/productdetail.do")
	@ResponseBody
	public Product productDetail(String no){
		Product p = null;
		try {
			p = dao.selectByNo(no);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return p;
	}
	
	
}
