package com.my.control;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

import com.my.dao.BoardDAOOracle;
import com.my.vo.RepBoard;

@Controller
public class BoardController {
	private final static int pageSize = 6; // 페이지 당 글 갯수
	private final static int pageGroupSize = 3; // 보여질 페이지 갯수

	@Autowired
	private BoardDAOOracle dao;

	@RequestMapping(value = "/boardlist.do")
	public String boardlist(@RequestParam(required = false, defaultValue = "no") String searchItem,
			@RequestParam(required = false, defaultValue = "") String searchValue, String pageNum, Model model) {
		List<RepBoard> list = new ArrayList<>();
		List<RepBoard> articleList = new ArrayList<>();

		if (pageNum == null)
			pageNum = "1";

		int currentPage = Integer.parseInt(pageNum);
		int startRow = (currentPage - 1) * pageSize + 1;// 한 페이지의 시작글 번호
		int endRow = currentPage * pageSize;// 한 페이지의 마지막 글번호
		int count = 0;
		int number = 0;

		try {
			list = dao.selectAll();

			if ("name".equals(searchItem) && !"".equals(searchValue))
				list = dao.selectByCont(searchValue);
			else if ("no".equals(searchItem) && !"".equals(searchValue))
				list = dao.selectByNo(Integer.parseInt(searchValue));
			else
				list = dao.selectAll();

			/* Paging */
			count = list.size();

			if (count > 0) {
				if (endRow > count)
					endRow = count;
				for (int i = startRow - 1; i < endRow; i++) {
					articleList.add(list.get(i));
				}
			} else
				articleList = null;

			number = count - (currentPage - 1) * pageSize; // 글목록에 표시할 글번호

			int pageGroupCount = count / (pageSize * pageGroupSize) + (count % (pageSize * pageGroupSize) == 0 ? 0 : 1); // 페이지그룹 갯수
			int numPageGroup = (int) Math.ceil((double) currentPage / pageGroupSize); // 페이지그룹순서

			// 해당 뷰에서 사용할 속성
			model.addAttribute("currentPage", new Integer(currentPage));
			model.addAttribute("startRow", new Integer(startRow));
			model.addAttribute("endRow", new Integer(endRow));
			model.addAttribute("count", new Integer(count));
			model.addAttribute("pageSize", new Integer(pageSize));

			model.addAttribute("number", new Integer(number));
			model.addAttribute("pageGroupSize", new Integer(pageGroupSize));
			model.addAttribute("numPageGroup", new Integer(numPageGroup));
			model.addAttribute("pageGroupCount", new Integer(pageGroupCount));
			model.addAttribute("result", articleList);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "result_board_list.jsp";
	}

	@RequestMapping("/boardwrite.do")
	public String write(String parent, String subject, String password, String content, String ip) {
		try {
			if (null == parent)
				parent = "0";
			int parentNum = Integer.parseInt(parent);
			content = content + "<br><br>" + ip;
			dao.insert(new RepBoard(parentNum, subject, content, password));
		} catch (Exception e) {
		}

		return "boardlist.do";
	}

	@RequestMapping(value = "/boarddelete.do")
	public String delete(String no, Model model) {
		int noInt = 0;
		String result = "0";
		try {
			noInt = Integer.parseInt(no);
			if (dao.selectByNo(noInt).size() == 1) {
				dao.delete(noInt);
				result = "1";
			} else
				result = "-1";

			model.addAttribute("result", result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "result.jsp";
	}

	@RequestMapping(value = "/boarddetail.do")
	public String boarddetail(String no, Model model) {
		int noInt = 0;
		if (!no.equals("") || no != null)
			noInt = Integer.parseInt(no);

		List<RepBoard> boardlist = null;
		try {
			boardlist = dao.selectByNo(noInt);
		} catch (Exception e) {
			e.printStackTrace();
		}
		model.addAttribute("result", boardlist);
		return "result_board_detail.jsp";
	}

	@RequestMapping(value = "/boardget.do")
	public String boardget(int no, Model model) {
		RepBoard b = null;
		try {
			b = dao.selectByNo(no).get(0);
		} catch (Exception e) {
			e.printStackTrace();
		}
		model.addAttribute("result", b);
		return "result_board.jsp";
	}

	@RequestMapping("/checkpassword.do")
	public String checkpassword(String pwd, int no, Model model) {
		String result = "1";
		try {
			if (dao.chkPassword(no, pwd))
				 result = "1";
			else result = "-1";
		} catch (Exception e) {
			e.printStackTrace();
		}
		model.addAttribute("result", result);
		return "result.jsp";
	}

	@RequestMapping("/boardmodify.do")
	public String modify(@RequestParam("parent") String no, String subject, String password, String content) {
		try {
			if (null == no)
				no = "0";
			RepBoard board = new RepBoard(Integer.parseInt(no), 0, subject, content, password);
			dao.update(board);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "boardlist.do";
	}
}
