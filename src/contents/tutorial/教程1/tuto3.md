---
title: 教程3
updated: 2026-09-04
---

中文部分 | Chinese

在数字设计和前端开发的世界里，颜色是我们每天都要打交道的基础元素。你可能听说过 HEX、RGB，也可能用过 HSL，但 HSB 和 HSL 的关系却常常让人感到困惑。其实，它们都是为了让我们更直观地理解和选择颜色而设计的模型，但在电脑的世界里，它们的算法和最终呈现的效果并不完全相同。

简单来说，HSB 中的“B”代表明度，它控制的是颜色中混入黑色的程度；而 HSL 中的“L”代表亮度，它同时控制颜色中混入黑色和白色的比例。这个根本性的差异，导致了一个很有意思的现象：在 HSL 模型中，纯色（色相环上最鲜艳的颜色）总是在亮度为 50% 时出现；而在 HSB 模型中，只有当饱和度与明度都达到 100% 时，我们才能看到最纯的颜色。

当你把这些概念带到实际工作中，就会发现它们的差异会直接影响你的设计稿和最终的网页呈现。例如，设计师在 Photoshop 中调整的 HSB 色值，如果直接复制到 CSS 代码中使用，是无效的，因为 CSS 标准支持的是 HSL，而不是 HSB。如果你希望颜色准确无误，就必须进行转换，或者使用一些像 CSS 预处理器或 PostCSS 插件这样的工具来帮助你。

英文部分 | English

In the world of digital design and front-end development, color is one of the most fundamental elements we deal with daily. You might be familiar with HEX and RGB, and you’ve probably heard of HSL. However, the relationship between HSB and HSL is a common source of confusion. Both models are designed to help us understand and select colors more intuitively, but in the computer's world, their underlying algorithms and final visual outputs are quite different.

To put it simply, the 'B' in HSB stands for Brightness, which controls how much black is mixed into a color. On the other hand, the 'L' in HSL stands for Lightness, which controls the amount of both black and white mixed in. This fundamental difference leads to an interesting phenomenon: in the HSL model, a pure color (the most saturated color on the hue wheel) always appears at 50% lightness. In contrast, in the HSB model, the purest color is achieved only when both saturation and brightness reach 100%.

When you bring these concepts into real-world practice, you'll see that this distinction directly affects the accuracy of your design work. For instance, if a designer gives you an HSB value from Photoshop and you copy it directly into your CSS code, it won't work. That's because the CSS standard supports HSL, not HSB. To ensure your colors appear precisely as intended, you need to convert them, or use helper tools like CSS preprocessors or PostCSS plugins.

<table>
        <thead>
            <tr>
                <th>姓名</th>
                <th>部门</th>
                <th>职位</th>
                <th>邮箱</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>张明</td>
                <td>技术部</td>
                <td>前端工程师</td>
                <td>zhangming@example.com</td>
            </tr>
            <tr>
                <td>李丽</td>
                <td>设计部</td>
                <td>UI设计师</td>
                <td>lili@example.com</td>
            </tr>
            <tr>
                <td>王强</td>
                <td>市场部</td>
                <td>市场经理</td>
                <td>wangqiang@example.com</td>
            </tr>
            <tr>
                <td>陈雪</td>
                <td>技术部</td>
                <td>后端工程师</td>
                <td>chenxue@example.com</td>
            </tr>
        </tbody>
    </table>
