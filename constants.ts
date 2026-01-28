export const DEFAULT_JSON = `{
  "analysis": {
    "homework_title": "等腰直角三角形与圆组合图形的面积计算",
    "wrong_questions": [
      {
        "image_index": 0,
        "coordinates": [
          18,
          5,
          968,
          985
        ],
        "problem_types": [
          "计算题"
        ],
        "problem_title": "组合图形面积计算",
        "problem_text": "2. 已知图中等腰直角三角形的直角边边长是 $12\\\\text{ cm}$，求涂色部分的面积。(5分)",
        "student_answer": "$12 \\\\div 2 = 6$, $12 \\\\times 6 \\\\div 2 = 36$, $6 \\\\times 3.14 = 18.84$, $6 \\\\times 3.14 \\\\times 6 \\\\div 4 = 28.26$, $6 \\\\times 6 \\\\div 2 = 18$。最终未得出正确结果。",
        "error_tags": [
          "概念混淆",
          "解题步骤缺失"
        ],
        "error_reason": "学生虽然识别出了图形中的关键组成部分（四分之一圆和小型等腰直角三角形），但在整体逻辑上出现了断层。学生未能建立起“阴影面积 = 大三角形面积 - 空白部分面积”的完整解题思路。此外，计算过程中出现了如 $6 \\\\times 3.14$ 这样错误的公式应用，反映出对圆面积公式的基础掌握不够扎实。",
        "standard_answer": "解：由题意知，等腰直角三角形的直角边 $a = 12\\\\text{ cm}$，则其面积为：\\n$S_{\\\\triangle ABC} = \\\\frac{1}{2} \\\\times 12 \\\\times 12 = 72\\\\text{ (cm}^2\\\\text{)}$\\n图中半圆的直径为 $12\\\\text{ cm}$，则半径 $r = 6\\\\text{ cm}$。\\n连接圆心 $O$ 与斜边上的交点 $D$（即斜边中点），空白部分可分为一个圆心角为 $90^\\\\circ$ 的扇形 $OBD$ 和一个直角边为 $6\\\\text{ cm}$ 的等腰直角三角形 $ODC$。\\n$S_{\\\\text{扇形}} = \\\\frac{1}{4} \\\\pi r^2 = \\\\frac{1}{4} \\\\times 3.14 \\\\times 6^2 = 28.26\\\\text{ (cm}^2\\\\text{)}$\\n$S_{\\\\triangle ODC} = \\\\frac{1}{2} \\\\times 6 \\\\times 6 = 18\\\\text{ (cm}^2\\\\text{)}$\\n空白部分总面积 $S_{\\\\text{空白}} = 28.26 + 18 = 46.26\\\\text{ (cm}^2\\\\text{)}$\\n涂色部分面积 $S_{\\\\text{阴影}} = S_{\\\\triangle ABC} - S_{\\\\text{空白}} = 72 - 46.26 = 25.74\\\\text{ (cm}^2\\\\text{)}$\\n答：涂色部分的面积是 $25.74\\\\text{ cm}^2$。"
      }
    ]
  }
}`;
