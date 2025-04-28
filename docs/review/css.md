1. 详细说说 Flex 布局
    <details open>

    flex 布局核心就是：容器和子元素

    1. 容器
        1. display: flex;
        2. 定义方向：flex-direction: row | column | row-reverse | column-reverse;
        3. 定义子项是否换行：flex-wrap: nowrap | wrap;
        4. 定义子元素在主轴上的对齐方式。 justify-content: flex-start | flex-end | center | space-between | space-around;
        5. 定义子元素在交叉轴上的对齐方式。 align-items: flex-start | flex-end | center | baseline | stretch;
        6. 怎么理解主轴和交叉轴呢，主轴是 flex-direction 定义的方向，交叉轴是垂直于主轴的轴。
    2. 容器内子元素
        1. flex: 1;是简写形式，flex: 1; 等同于 flex: 1 1 auto;包含三个值：flex-grow、flex-shrink、flex-basis。分别代表：子项的放大比例、子项的缩小比例、子项的基准值。
        2. 定义单个子项在交叉轴上的对齐方式。会覆盖 align-items align-self: auto | flex-start | flex-end | center | baseline | stretch;

2. 详细说说 Grid 布局
    <details open>

    grid 布局核心同样是容器和子元素

    1. 容器
        1. display: grid;
        2. grid-template-columns: 100px 100px 100px; 是指子元素的宽度。三个值分别代表三个子元素的宽度。如果有更多的列，会重复。
        3. grid-template-rows: 100px 100px 100px; 是指子元素的高度。三个值分别代表三个子元素的高度。如果有更多的行，会重复。
        4. grid-gap: 10px;是指子元素之间的间距。
        5. grid-template-areas: "a b c";
        6. justify-items: start | end | center | stretch;
        7. align-items: start | end | center | stretch;
        8. justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
    2. 子元素
        1. grid-column-start: 1; 定义子元素在网格中的开始列
        2. grid-column-end: 3; 定义子元素在网格中的结束列
        3. grid-row-start: 1; 定义子元素在网格中的开始行
        4. grid-row-end: 3; 定义子元素在网格中的结束行

3. flex 布局与 grid 布局的区别
   **Flex 布局与 Grid 布局对比**

    1. 布局维度

        | **特性**     | **Flex 布局**            | **Grid 布局**      |
        | ------------ | ------------------------ | ------------------ |
        | **布局维度** | 一维布局（行或列）       | 二维布局（行和列） |
        | **适用场景** | 适合简单的内容对齐或分布 | 适合复杂的页面布局 |

    2. 容器属性

        | **特性**     | **Flex 布局**                  | **Grid 布局**                               |
        | ------------ | ------------------------------ | ------------------------------------------- |
        | **主轴方向** | flex-direction                 | grid-template-rows 和 grid-template-columns |
        | **子项对齐** | justify-content 和 align-items | justify-items 和 align-items                |
        | **间距**     | 通过 margin 或 gap             | 通过 grid-gap 或 gap                        |

    3. 子项属性

        | **特性**     | **Flex 布局**                      | **Grid 布局**              |
        | ------------ | ---------------------------------- | -------------------------- |
        | **子项大小** | flex-grow、flex-shrink、flex-basis | grid-row 和 grid-column    |
        | **子项对齐** | align-self                         | justify-self 和 align-self |

    4. 响应式设计

        | **特性**     | **Flex 布局**                | **Grid 布局**                    |
        | ------------ | ---------------------------- | -------------------------------- |
        | **适用场景** | 更适合简单的响应式设计       | 更适合复杂的响应式设计           |
        | **动态调整** | 子项可以根据内容动态调整大小 | 网格可以根据屏幕大小动态调整布局 |

    5. 使用场景

        | **场景**         | **Flex 布局**   | **Grid 布局**                         |
        | ---------------- | --------------- | ------------------------------------- |
        | **简单对齐**     | Flex 布局更适合 | Grid 布局也可以实现，但不如 Flex 简洁 |
        | **复杂网格布局** | 不适合          | Grid 布局更适合                       |

    6. 优缺点对比

        | **特性** | **Flex 布局**          | **Grid 布局**                      |
        | -------- | ---------------------- | ---------------------------------- |
        | **优点** | 简单易用，适合一维布局 | 支持二维布局，适合复杂的页面结构   |
        | **缺点** | 不支持二维布局         | 语法较复杂，低版本浏览器兼容性较差 |

4. 一像素边框解决方案

     <details open>

    after 标签使用 transform: scale(0.5);

    如果只要单边的边框的话，对应的那边的 after 标签 border-XX-width: 0 即可。

    ```css
    position: absolute;
    content: '';
    display: block;
    top: 0;
    right: -100%;
    left: 0;
    bottom: -100%;
    pointer-events: none;
    z-index: 1;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    transform-origin: 0 0;
    border: 1px solid #ddd;
    border-radius: 0;

    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
        .border_1px:before {
            transform: scaleY(0.5);
        }
    }
    @media only screen and (-webkit-min-device-pixel-ratio: 3) {
        .border_1px:before {
            transform: scaleY(0.33);
        }
    }
    ```

5. 环绕文字的 css 属性 shape-outside

    <details open>

    ```css
    shape-outside: circle();
    shape-outside: ellipse();
    shape-outside: inset(10px 10px 10px 10px);
    shape-outside: polygon(10px 10px, 20px 20px, 30px 30px);
    ```

    使用 shape-outside，可以让文字环绕一个圆形图片。

6. 什么是 BFC，触发 BFC 的方式

     <details open>

    简单来说，BFC 就是一个独立不干扰外界也不受外界干扰的盒子。

    浮动元素、绝对定位元素，'display' 特性为 "inline-block"，"table-cell"， "table-caption" 的元素，

    以及 'overflow' 不是 "visible" 的元素，会创建新的 BFC(Block formatting contexts)。

7. rem 的写法 VW 的写法

     <details open>

    device-width / 750 \* 100;

    以 iphone6 为例，375/750 \* 100=50px;

    50px 设置在 HTML 的根元素上。

    设计稿通常也是 750 宽，这样设计稿上是 24px, 0.24 \* 50 = 12px，渲染到屏幕上就是 12px；

    以上代码写在 index html 里的 script 标签里。

    使用 vw 单位的话，屏幕的宽度就是 100vw，那么 24px/750px \* 100 = 对应的 vw。这样写 font-size 的时候直接写 vw(24)就可以了；

    ```css
    $vm_base: 750;
    @function vw($px) {
        @return ($px / $vm_base) * 100vw;
    }
    ```

8. css 画三角形、梯形的原理

     <details open>

    利用 border 来画。

    如果是个向上的三角型。那么给它的底边框上色。div 宽为 0，上边框是 0，左右设置 10px，下边框 20px，上左右颜色透明。

    如果是个向右的三角型。可以给它的左边框上色。div 高为 0，右边框是 0.上下右颜色透明。上下设置 10px,左边设置 20px。

    想要画梯形的话，如果是刚刚向上的三角型，把宽改成不为 0，如果是向右的三角型，把高改为不为 0

9. css 如何实现定宽高比

     <details open>

    假如某个元素要有定宽高比，先给他上个 display: flex，然后给他加个 after

    这个 after 写个 padding-top: 100%;那么这个时候，这个元素改宽度，高度也会跟着变。

    主要是因为 padding 的百分比是相对于其包含块的宽度来的。

10. background-repeat 新属性值

     <details open>

    round 和 space 一个是取整，一个是间距

    round 是尽可能的多重复，铺满背景，可能会拉伸。

    而 space 是保证不缩放的前提下铺图片，并等分空隙。

11. 如何实现一个滚动视差

     <details open>

    ```css
    <section class="g-word">Header</section>
    <section class="g-img">IMG1</section>
    <section class="g-word">Content1</section>
    <section class="g-img">IMG2</section>
    <section class="g-word">Content2</section>
    <section class="g-img">IMG3</section>
    <section class="g-word">Footer</section>
    ```

    利用 background-attachment fixed。可以把背景固定在那个块上。这样在滚动的时候会有一个视差效果。
    这个图片会自动滚动到视窗的时候不动，然后被下面的文本或图片给冲上去。

12. 非背景的情况下，img 如何保持它自己的尺寸比例 比如外面是 300-100，它自己是 300-300

     <details open>

    使用 object-fit 可以保持原有的尺寸比例，

    contain 就是以小边为基准

    cover 就是以大边为基准的放大居中裁切

13. 背景虚化，毛玻璃效果，比如登陆的时候希望背景模糊

    <details open>

    可以使用 filter: blur(1px);来解决

14. img srcset， image-set

    <details open>

    多数情况下，我们的图片都是以 dpr2 来设置的，也就是说，实际情况下，iphoneX 下显示的图片会有略微的模糊。但是专门去适配的很少，因为都是网络上传的图片。

    如果后台支持的话，可以用 srcset 来做到。只需要提供图片资源、以及断点，其他都交给浏览器智能解决，浏览器会自动根据场景匹配最佳显示图片

    ```css
    <img
        src='128px.jpg'
        srcset='128px.jpg 128w, 256px.jpg 256w, 512px.jpg 512w'
        sizes='(max-width: 360px) calc(100vw - 20px), 128px'
        > 上面的128w，指宽度，sizes就是配合w使用，根据size找最贴合条件的srcset图片
        可以直接用1x,
    2x，这样就不需要用size了
        srcset='128px.jpg 1x, 256px.jpg 2x'
        移动端完美支持，就算安卓4.3、4.4不支持也可以用默认的src
        如果是背景的话，还有一个熟悉image-set可以用，就是不支持安卓4.3
        div {
        background-image: image-set(url(test.png) 1x, url(test-2x.png) 2x);
    }
    ```

15. css 选择器的优先级

    <details open>

    在同一个层级下，important> 内联 > ID 选择器 > 类选择器 > 标签选择器。

16. reflow 和 repaint，compositions（？复合）

    <details open>

    回流的话就是动了结构，浏览器会重新渲染部分内容或全部内容，重绘的话是不改变结构，只变个颜色之类的，回流必然会导致重绘，重绘不一定导致回流。

    合成层就相当于脱离当前层，比如利用 CSS3 的 transform、opacity、filter 这些属性就可以实现合成的效果，

    也就是常说的 GPU 加速。添加 will-change: tranform ，

    让渲染引擎为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。

17. 如何减少回流呢？

    <details open>

    1. 避免逐项更改样式。最好一次性更改 style 属性，或者将样式列表定义为 class 并一次性更改 class 属性。
    2. 避免循环读取 offsetLeft 等属性。在循环之前把它们存起来。
    3. 绝对定位具有复杂动画的元素。绝对定位使它脱离文档刘，否则会引起父元素及后续元素大量的回流。
    4. 使用 transform 进合成层
    5. **避免循环操作 DOM。创建一个 documentFragment (文档片段) 或 div (display: none)，在它上面应用所有 DOM 操作，最后再把它添加到 window.document。**

    因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。

    React 和 vue 也类似这样的操作方案

18. block,inline,inline-block 的区别

    <details open>

    - block 元素会独占一行，多个 block 元素会各自新起一行。默认情况下，block 元素宽度自动填满其父元素宽度。
    - block 元素可以设置 width,height 属性。块级元素即使设置了宽度,仍然是独占一行。
    - block 元素可以设置 margin 和 padding 属性。
    - inline 元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
    - inline 元素设置 width,height 属性无效。
    - inline 元素的 margin 和 padding 属性，水平方向的 padding-left, padding-right, margin-left, margin-right 都产生边距效果；但竖直方向的 padding-top, padding-bottom, margin-top, margin-bottom 不会产生边距效果。
    - inline-block 简单来说就是将对象呈现为 inline 对象，但是对象的内容作为 block 对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个 link（a 元素）inline-block 属性值，使其既具有 block 的宽度高度特性又具有 inline 的同行特性

19. 移动端适配（dp,ppi,dpr,dip)

    <details open>

    - dp,设备物理像素。比如 iphone6 屏幕分辨率是 750\*1334. iphoneX 是 1125\*xxxx
    - ppi,像素密度，就是每英寸的物理像素点数有多少。
    - dip，设备独立像素，可以称为逻辑像素，就是我们正常使用的 375,414,使用 window.screen.width 可以获取。
    - dpr，设备像素比，可以通过 window.devicePixelRatio 获取,并不是绝对的使用 dp/dip 获得的

        比如 iphone 6+是一个特殊的，它实际分辨率是 1920\*1080,但是逻辑像素却是 414，它通过采样率缩放的一个方式做到的。

20. 检测横屏

    <details open>

    ```css
    window.orientation === 90 || window.orientation === -90 就代表是横屏

    @media screen and (orientation: portrait // 竖屏， // landscape 横屏)
    ```

21. iphoneX 适配

    <details open>

    `<meta name="viewport" content="viewport-fit=cover">`

    meta 标签里的 viewport-fit cover, contain

    ```css
    safe-area-inset-left：安全区域距离左边边界距离
    safe-area-inset-right：安全区域距离右边边界距离
    safe-area-inset-top：安全区域距离顶部边界距离
    safe-area-inset-bottom：安全区域距离底部边界距离
    ```

    constant 在 `iOS < 11.2` 的版本中生效，env 在 `iOS >= 11.2` 的版本中生效，这意味着我们往往要同时设置他们，将页面限制在安全区域内：

    ```css
     {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
    ```

    这里的`safe-area-inset-xx`就是一个常量，直接用就可以了

22. css 里常用的@

    <details open>

    - @charset 声明编码格式
    - @import 引入 css 文件
    - @media 不用说了
    - @keyframes 动画帧
    - @counter-style 定义列表项的表现
    - @font-face 定义字体

23. css 里常用的函数

    <details open>

    - calc() 计算函数，中间必须要有空格
    - max,min, 取大小
    - filter 对图片进行滤镜处理
    - transform 各种变换

24. 如何让图文不可复制

    <details open>

    `user-select: none;`

25. 实现永久动画

    <details open>

    `animation-iteration-count: infinite`

26. 如何让网站全站变灰色

    <details open>

    给 HTML 元素，上一段 CSS

    ```css
    html {
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='grayscale'><feColorMatrix type='matrix' values='0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'/></filter></svg>#grayscale");
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        -webkit-filter: grayscale(1);
    }
    ```

27. 如何实现单边阴影？

    <details open>

    `box-shadow` 属性用于在元素的框架上添加阴影效果。 你可以在同一个元素上设置多个阴影效果，并用 `逗号` 将他们分隔开。 该属性可设置的值包括阴影的`X轴偏移量`、`Y轴偏移量`、`模糊半径`、`扩散半径`和`颜色`

    `box-shadow: 0 5px 10px -5px red;`

28. css keyframes 动画

    `animation: name duration timing-function delay iteration-count direction;`

    ```css
    @keyframes example {
        from {
            background-color: red;
        }
        to {
            background-color: yellow;
        }
    }
    @keyframes example {
        0% {
            background-color: red;
        }
    ```

29. overflow-anchor 这个属性的意义

    可以利用 Overflow-anchor，实现上方 append 了很多内容，而视窗纹丝不动，不会被挤下来，但是 iphone 不支持。

    [张鑫旭 overflow-anchor](https://www.zhangxinxu.com/wordpress/2020/08/css-overflow-anchor/)

    [caniuse overflow-anchor](https://caniuse.com/?search=overflow-anchor)

30. 如果在 ios 里，容器宽度发生变化的情况下，如何保证内容的第一行位置不变？

    [张鑫旭 滚动容器 elementsFromPoint](https://www.zhangxinxu.com/wordpress/2018/02/container-scroll-position-hold/)
