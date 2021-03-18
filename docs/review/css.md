
1. 一像素边框解决方案

   after 标签使用 transform: scale(0.5);

   如果只要单边的边框的话，对应的那边的 after 标签 border-XX-width: 0 即可。

   ```css
   position: absolute;
   content: "";
   display: block;
   top: 0;
   right: -100%;
   left: 0;
   bottom: -100%;
   pointer-events: none;
   z-index: 1;
   -webkit-transform: scale(.5);
   transform: scale(.5);
   transform-origin: 0 0;
   border: 1px solid #ddd;
   border-radius: 0;

   @media only screen and (-webkit-min-device-pixel-ratio:2){
        .border_1px:before{
            transform: scaleY(0.5);
        }
    }
    @media only screen and (-webkit-min-device-pixel-ratio:3){
        .border_1px:before{
            transform: scaleY(0.33);
        }
    }
   ```

2. 环绕文字的 css 属性 shape-outside

   ```css
   shape-outside: circle();
   shape-outside: ellipse();
   shape-outside: inset(10px 10px 10px 10px);
   shape-outside: polygon(10px 10px, 20px 20px, 30px 30px);
   ```

   使用 shape-outside，可以让文字环绕一个圆形图片。

3. 什么是 BFC，触发 BFC 的方式

   简单来说，BFC 就是一个独立不干扰外界也不受外界干扰的盒子。

   浮动元素、绝对定位元素，'display' 特性为 "inline-block"，"table-cell"， "table-caption" 的元素，

   以及 'overflow' 不是 "visible" 的元素，会创建新的 BFC(Block formatting contexts)。

4. rem 的写法 VW 的写法

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

5. css 画三角形、梯形的原理

   利用 border 来画。

   如果是个向上的三角型。那么给它的底边框上色。div 宽为 0，上边框是 0，左右设置 10px，下边框 20px，上左右颜色透明。

   如果是个向右的三角型。可以给它的左边框上色。div 高为 0，右边框是 0.上下右颜色透明。上下设置 10px,左边设置 20px。

   想要画梯形的话，如果是刚刚向上的三角型，把宽改成不为 0，如果是向右的三角型，把高改为不为 0

6. css 如何实现定宽高比

   假如某个元素要有定宽高比，先给他上个 display: flex，然后给他加个 after

   这个 after 写个 padding-top: 100%;那么这个时候，这个元素改宽度，高度也会跟着变。

   主要是因为 padding 的百分比是相对于其包含块的宽度来的。

7. background-repeat 新属性值

   round 和 space 一个是取整，一个是间距

   round 是尽可能的多重复，铺满背景，可能会拉伸。

   而 space 是保证不缩放的前提下铺图片，并等分空隙。

8. 如何实现一个滚动视差

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

9. 非背景的情况下，img 如何保持它自己的尺寸比例 比如外面是 300-100，它自己是 300-300

   使用 object-fit 可以保持原有的尺寸比例，

   contain 就是以小边为基准

   cover 就是以大边为基准的放大居中裁切

10. 背景虚化，毛玻璃效果，比如登陆的时候希望背景模糊

    可以使用 filter: blur(1px);来解决

11. img srcset， image-set

    多数情况下，我们的图片都是以 dpr2 来设置的，也就是说，实际情况下，iphoneX 下显示的图片会有略微的模糊。但是专门去适配的很少，因为都是网络上传的图片。

    如果后台支持的话，可以用 srcset 来做到。只需要提供图片资源、以及断点，其他都交给浏览器智能解决，浏览器会自动根据场景匹配最佳显示图片

    ```css
    <img src="128px.jpg"
        srcset="128px.jpg 128w, 256px.jpg 256w, 512px.jpg 512w"
        sizes="(max-width: 360px) calc(100vw - 20px), 128px">
        上面的128w，指宽度，sizes就是配合w使用，根据size找最贴合条件的srcset图片
        可以直接用1x,2x，这样就不需要用srcset了
        srcset="128px.jpg 1x, 256px.jpg 2x"
        移动端完美支持，就算安卓4.3、4.4不支持也可以用默认的src
        如果是背景的话，还有一个熟悉image-set可以用，就是不支持安卓4.3
        div {
            background-image: image-set( url(test.png) 1x, url(test-2x.png) 2x );
        }
    ```

12. css 选择器的优先级

    在同一个层级下，important> 内联 > ID 选择器 > 类选择器 > 标签选择器。

13. reflow 和 repaint，compositions（？复合）

    回流的话就是动了结构，浏览器会重新渲染部分内容或全部内容，重绘的话是不改变结构，只变个颜色之类的，回流必然会导致重绘，重绘不一定导致回流。

    合成层就相当于脱离当前层，比如利用 CSS3 的 transform、opacity、filter 这些属性就可以实现合成的效果，

    也就是常说的 GPU 加速。添加 will-change: tranform ，

    让渲染引擎为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。

14. block,inline,inline-block 的区别

    - block 元素会独占一行，多个 block 元素会各自新起一行。默认情况下，block 元素宽度自动填满其父元素宽度。
    - block 元素可以设置 width,height 属性。块级元素即使设置了宽度,仍然是独占一行。
    - block 元素可以设置 margin 和 padding 属性。
    - inline 元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
    - inline 元素设置 width,height 属性无效。
    - inline 元素的 margin 和 padding 属性，水平方向的 padding-left, padding-right, margin-left, margin-right 都产生边距效果；但竖直方向的 padding-top, padding-bottom, margin-top, margin-bottom 不会产生边距效果。
    - inline-block 简单来说就是将对象呈现为 inline 对象，但是对象的内容作为 block 对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个 link（a 元素）inline-block 属性值，使其既具有 block 的宽度高度特性又具有 inline 的同行特性

15. 移动端适配（dp,ppi,dpr,dip)

    - dp,设备物理像素。比如 iphone6 屏幕分辨率是 750*1334. iphoneX 是 1125*xxxx
    - ppi,像素密度，就是每英寸的物理像素点数有多少。
    - dip，设备独立像素，可以称为逻辑像素，就是我们正常使用的 375,414,使用 window.screen.width 可以获取。
    - dpr，设备像素比，可以通过 window.devicePixelRatio 获取,并不是绝对的使用 dp/dip 获得的

      比如 iphone 6+是一个特殊的，它实际分辨率是 1920\*1080,但是逻辑像素却是 414，它通过采样率缩放的一个方式做到的。

16. 检测横屏

    ```css
    window.orientation === 90 || window.orientation === -90 就代表是横屏

    @media screen and (orientation: portrait // 竖屏， // landscape 横屏)
    ```

17. iphoneX 适配

    `<meta name="viewport" content="viewport-fit=cover">`

    meta 标签里的 viewport-fit cover, contain

    ```css
    safe-area-inset-left：安全区域距离左边边界距离
    safe-area-inset-right：安全区域距离右边边界距离
    safe-area-inset-top：安全区域距离顶部边界距离
    safe-area-inset-bottom：安全区域距离底部边界距离
    ```

    constant 在 iOS < 11.2 的版本中生效，env 在 iOS >= 11.2 的版本中生效，这意味着我们往往要同时设置他们，将页面限制在安全区域内：

    ```css
    {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
    ```

18. css 里常用的@

    - @charset 声明编码格式
    - @import 引入 css 文件
    - @media 不用说了
    - @keyframes 动画帧
    - @counter-style 定义列表项的表现
    - @font-face 定义字体

19. css 里常用的函数
    - calc() 计算函数，中间必须要有空格
    - max,min, 取大小
    - filter 对图片进行滤镜处理
    - transform 各种变换
20. 如何让图文不可复制

    user-select: none;

21. 实现永久动画

    animation-iteration-count: infinite
22. 如何让网站全站变灰色
    给HTML元素，上一段CSS
    ```css
     html {
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        -webkit-filter: grayscale(1);
    }

    ```