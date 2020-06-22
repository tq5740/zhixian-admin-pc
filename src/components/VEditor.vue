<template>
  <div class="eded">
    <div class="btn-toolbarclass" data-role="editor-toolbar" data-target="#editor">
      <div class="btn-group">
        <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font">
          <i class="icon-font"></i>
          <b class="caret"></b>
        </a>
        <ul class="dropdown-menu"> </ul>
      </div>
      <div class="btn-group">
        <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font Size">
          <i class="icon-text-height"></i>
          <b class="caret"></b>
        </a>
        <ul class="dropdown-menu">
          <li>
            <a data-edit="fontSize 5">
              <font size="5">Huge</font>
            </a>
          </li>
          <li>
            <a data-edit="fontSize 3">
              <font size="3">Normal</font>
            </a>
          </li>
          <li>
            <a data-edit="fontSize 1">
              <font size="1">Small</font>
            </a>
          </li>
        </ul>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)">
          <i class="icon-bold"></i>
        </a>
        <!--加粗-->
        <a class="btn" data-edit="italic" title="Italic (Ctrl/Cmd+I)">
          <i class="icon-italic"></i>
        </a>
        <!-- 斜体-->
        <a class="btn" data-edit="strikethrough" title="Strikethrough">
          <i class="icon-strikethrough"></i>
        </a>
        <!-- 删除线-->
        <a class="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)">
          <i class="icon-underline"></i>
        </a>
        <!-- 下划线-->
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="insertunorderedlist" title="Bullet list">
          <i class="icon-list-ul"></i>
        </a>
        <!-- 加点-->
        <!-- <a class="btn" data-edit="insertorderedlist" title="Number list">
              <i class="icon-list-ol"></i>
            </a> -->
        <!-- 数字排序-->
        <!-- <a class="btn" data-edit="outdent" title="Reduce indent (Shift+Tab)">
              <i class="icon-indent-left"></i>
            </a> -->
        <!-- 减少缩进-->
        <a class="btn" data-edit="indent" title="Indent (Tab)">
          <i class="icon-indent-right"></i>
        </a>
        <!--增加缩进-->
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="justifyleft" title="Align Left (Ctrl/Cmd+L)">
          <i class="icon-align-left"></i>
        </a>
        <!--左对齐-->
        <a class="btn" data-edit="justifycenter" title="Center (Ctrl/Cmd+E)">
          <i class="icon-align-center"></i>
        </a>
        <!--居中-->
        <a class="btn" data-edit="justifyright" title="Align Right (Ctrl/Cmd+R)">
          <i class="icon-align-right"></i>
        </a>
        <!--右对齐-->
        <a class="btn" data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)">
          <i class="icon-align-justify"></i>
        </a>
        <!--垂直对齐-->
      </div>
      <div style="display:inline-block">
        <!-- <a class="btn dropdown-toggle" data-toggle="dropdown" title="Hyperlink">
          <i class="icon-link"></i>
        </a> -->
        <!-- 链接-->
        <div class="input-append">
          <input style="height:30px;line-height:30px;margin-bottom: 0;" class="span2" placeholder="插入链接" type="text" data-edit="createLink" />
          <button class="btn" type="button">Add</button>
        </div>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)">
          <i class="icon-undo"></i>
        </a>
        <!--撤销-->
        <a class="btn" data-edit="redo" title="Redo (Ctrl/Cmd+Y)">
          <i class="icon-repeat"></i>
        </a>
        <!--恢复-->
      </div>
      <div class="btn-group">
        <a class="btn" title="Insert picture (or just drag & drop)" :id="`pictureBtn`+Vkey">
          <i class="icon-picture"></i>
        </a>
        <input type="file" data-role="magic-overlay" :data-target="`#pictureBtn`+Vkey" data-edit="insertImage" />
      </div>
    </div>

    <div :id="`editor`+Vkey" class="editorCss" style="margin-top: 10px;
  min-height: 300px;
  border: 1px solid #666666;
  width: 100%;line-height: 29px;">
    </div>
  </div>
</template>

<script lang="ts">
/*
 module:
    editor.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:editor
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

//@ts-ignore
//https://github.com/ktsn/vuex-class
@Component({
  props: {
    Vkey: {
      type: String,
      default: "intro"
    }
  }
})
export default class VEditor extends Vue {
  @Prop({ default: "" })
  htmlStr!: string;
  editor: any = null;
  created() {}
  mounted() {
    this.$nextTick(() => {
      //@ts-ignore
      this.editor = $(`#editor${this.Vkey}`);
      function initToolbarBootstrapBindings() {
        var fonts = [
            "Serif",
            "Sans",
            "Arial",
            "Arial Black",
            "Courier",
            "Courier New",
            "Comic Sans MS",
            "Helvetica",
            "Impact",
            "Lucida Grande",
            "Lucida Sans",
            "Tahoma",
            "Times",
            "Times New Roman",
            "Verdana"
          ],
          //@ts-ignore
          fontTarget = $("[title=Font]").siblings(".dropdown-menu");
        //@ts-ignore
        $.each(fonts, function(idx, fontName) {
          fontTarget.append(
            //@ts-ignore
            $(
              '<li style="cursor: pointer"><a data-edit="fontName ' +
                fontName +
                '" style="font-family:\'' +
                fontName +
                "'\">" +
                fontName +
                "</a></li>"
            )
          );
        });
      }
      initToolbarBootstrapBindings();
      //@ts-ignore
      this.editor.wysiwyg();
      this.editor.html(decodeURIComponent(this.htmlStr));
    });
  }
  opneUrl() {}
  getHtml(): string | undefined {
    return encodeURIComponent(this.editor.html());
  }
  @Watch("htmlStr")
  change(val: string, oldVal: string) {
    this.editor.html(decodeURIComponent(this.htmlStr));
  }
}
</script>
<style lang="scss" scoped>
.fontChange {
  li {
    display: inline-block;
    margin-right: 4px;
    cursor: pointer;
  }
}
.btn-group {
  margin-bottom: 4px;
}
.btn {
  margin-right: 4px;
}

</style>
<style lang="scss">
.eded{
  .editorCss img{
    max-width: 100%;
  }
}
</style>
