<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
			
            <div class="plugins-tips">
                Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
                访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>
		<div :visible.sync="videoUploadTag"> 
		  <el-dialog width="50%" id="video_upload" style="margin-top: 1px" title="视频上传" :visible.sync="videoUploadTag" append-to-body>
			<el-tabs v-model="activeName" @tab-click="videoSelectTagClick" value="0">
			  <el-tab-pane label="添加视频链接" name="first">
				  <el-input v-model="videoLink" placeholder="请输入视频链接" clearable></el-input>   
				  <el-button type="primary" size="small" style="margin: 20px 0px 0px 0px " @click="addVideoLink()">添加</el-button>         
		      </el-tab-pane>      
			  <el-tab-pane label="素材库" name="second">请期待</el-tab-pane>    
			</el-tabs>    
		  </el-dialog> 
		</div>
           
			</div>
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
			
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    placeholder: 'Hello World'
                }
            }
        },
        components: {
            quillEditor,
			// editor() {
			//          return this.$refs.myQuillEditor.quill;
			//    }
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(){
                console.log(this.content);
                this.$message.success('提交成功！');
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>