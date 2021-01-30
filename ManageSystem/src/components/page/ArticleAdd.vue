<template>
	<div>
		<el-form ref="forms" :model="forms" :rules="rules" label-width="80px" :inline="true" style="text-align: center;">
			<el-form-item label="文章标题" prop="title">
				<el-input v-model="forms.title" style="width: 200px;"></el-input>
				
			</el-form-item>

			<el-form-item label="图片来源" prop="imgSource">
				<el-input v-model="forms.imgSource" placeholder="人大微信公众平台" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="宣传描述" prop="desc">
				<el-input v-model="forms.desc" placeholder="请输入" style="width: 200px;"></el-input>
			</el-form-item>

			<br />

			<el-form-item label="文章分类" prop="articleType">
				<el-select v-model="forms.articleType" placeholder="文章分类" style="width: 200px;">
					<el-option v-for="item in articleType" :value='item.id' :label="item.name" v-text="item.name"></el-option>
				</el-select>
			</el-form-item>


			<el-form-item label="所属领域" prop='territoryId'>
				<el-select v-model="forms.territoryId" placeholder="所属领域" style="width: 200px;">
					<el-option v-for="item in territory" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="所属产品" prop='productId'>
				<el-select v-model="forms.productId" placeholder="所属产品" style="width: 200px;">
					<el-option v-for="item in product" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>

			<br />
			
			<el-image :src='forms.imgUrl' v-if="showImg"></el-image>
			<br/>
			
			
			<el-form-item label="宣传图" style="margin-left: -200px;">
				<!-- <el-button type="primary" icon="el-icon-upload">点击上传</el-button> -->
				 
				<el-upload
					:file-list="imgList"
					ref='ImgUpload'
					:limit="1"
					:list-type="'picture'"
					:before-remove="fileRemove"
				    class="upload-demo"
				    drag
					accept=".jpg,.png,.jpeg,.JPG,.JPEG"
				    :action="$axios.defaults.baseURL+'/file/uploadImg'"
				     :on-success='imgUploadSuccess'  :headers="uploadHeader" :multiple='false'>
				    <i class="el-icon-upload"></i>
				    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
			</el-form-item>

			<el-form-item label="录像信息" style="margin-left: 300px;">
				 <el-upload
				 :file-list="videoList"
					ref='videoUpload'
					:limit="1"
					:list-type="'picture'"
					:before-remove="fileRemove"
				    class="upload-demo"
				    drag
					accept=".AVI,.MOV,.ASF,.RM,.NAVI,.mp4"
				    :action="$axios.defaults.baseURL+'/file/uploadVideo'"
					:data='videoType'
				     :on-success='videoUploadSuccess'  :headers="uploadHeader" :multiple='false'>
				    <i class="el-icon-upload"></i>
				    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload> 
			</el-form-item>

			<br />
			<br />
			<!-- markdown 富文本编辑器 -->
			<mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px;width: 100%;" />
			<br />
			
			<!-- 提交按钮 -->
			<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>

		</el-form>
	</div>
</template>

<script>
	import {
		mavonEditor
	} from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'


	var datas = {
		forms: {
			id:'', //文章id
			title: '', // 文章标题,
			imgSource: '', //图片来源
			desc: '', //描述
			territoryId: '', //领域id
			productId: '', // 产品id
			articleType: '', //产品分类 成功案例| 媒体报道
			content: '', //文章正文
			imgId:'',
			videoId:'',
			contentMarkdown:'',
			status:''
		},
		showImg:false, //图片是否显示 修改时使用
		content: '', // markdown 文本
		html:'',
		territory: [], //领域信息
		articleType: [], //文章信息
		product: [], //产品信息
		uploadHeader:{'token':window.localStorage.getItem("token")},
		videoType:{'type':2},
		rules: {
			title: [{
					required: true,
					message: '请输入文章标题',
					trigger: 'blur'
				},
				{
					min: 0,
					max: 999,
					message: '标题不能为空',
					trigger: 'blur'
				}
			],
			imgSource: [{
					required: true,
					message: '请输图片来源',
					trigger: 'blur'
				},
				{
					min: 0,
					max: 999,
					message: '图片来源不能为空',
					trigger: 'blur'
				}
			],
			desc: [{
					required: true,
					message: '请输宣传描述',
					trigger: 'blur'
				},
				{
					min: 0,
					max: 999,
					message: '宣传描述不能为空',
					trigger: 'blur'
				}
			],
			territoryId: [{
					required: true,
					message: '请选择领域',
					trigger: 'change'
				},
				{
					type: 'number',
					message: '请选择领域',
					trigger: 'change'
				}
			],
			
			articleType: [{
					required: true,
					message: '请选择文章分类',
					trigger: 'change'
				},
				{
					type: 'number',
					message: '请选择文章分类',
					trigger: 'change'
				}
			]
		},
		imgList:[],
		videoList:[],
	};
	export default {
		name: 'markdown',
		data: () => datas,
		components: {
			mavonEditor
		},
		// inject:['reload'],
		methods: {
			// 将图片上传到服务器，返回地址替换到md中
			$imgAdd(pos, $file) {
				var formdata = new FormData();
				formdata.append('file', $file);
				// 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
				this.$axios({
					url: '/file/uploadImg',
					method: 'post',
					data: formdata,
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				}).then((data) => {
					console.log( data.data);//markdown 上传图片后的回调 将图片的访问地址替换
					this.$refs.md.$img2Url(pos, data.data.accessPath);
				})
			},
			change(value, render) {
				// render 为 markdown 解析后的结果
				this.html = render;
			},
			//保存文章
			submit() {
				this.$refs.forms.validate(async (valid) => {
					console.log(this.$route.query.update);
					if (valid) { //验证通过
						if(this.forms.imgId==null || this.forms.imgId==''){
							this.$message.warning('请选择一张宣传图片');
							return;
						}
						this.forms.content = this.html;
						this.forms.contentMarkdown = this.content;
						this.forms.state = 1;
						//如果是update
						if(this.$route.query.update){
							var {data:result} = await this.$axios.post('/article/update',this.forms);
						}else{
							var {data:result} = await this.$axios.post('/article/save',this.forms);
						}
						
						//上传成功
						if(result.code==0){
							if(this.$route.query.update){
								this.$message.success("文章修改成功!");
							}else{
								this.$message.success("文章上传成功,但出于禁用状态!");
							}
							this.$router.replace("/Donate");
							//重置表单
							this.$refs.forms.resetFields();
							this.content = '';
							console.log(this.$refs);
							this.$refs.ImgUpload.clearFiles();
							this.$refs.videoUpload.clearFiles();
							// window.location.href = '/Donate';
						}
					} else {
						this.$message.warning("请完成表单录入");
						return false;
					}
				});
			},
			setImage(e) {
				const file = e.target.files[0];
				if (!file.type.includes('image/')) {
					return;
				}
				const reader = new FileReader();
				reader.onload = (event) => {
					this.dialogVisible = true;
					this.imgSrc = event.target.result;
					this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
				};
				reader.readAsDataURL(file);
			},
			cropImage() {
				this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
			},
			cancelCrop() {
				this.dialogVisible = false;
				this.cropImg = this.defaultSrc;
			},
			// imageuploaded(res) {
			// 	console.log(res)
			// },
			handleError() {
				this.$notify.error({
					title: '上传失败',
					message: '图片上传接口上传失败，可更改为自己的服务器接口'
				});
			},
			//------------------//
			//获取领域信息
			async getArticleTerritory() {
				const {
					data: result
				} = await window.axios.get("/territory/getTerritory");
				if (result.code == 0) {
					return this.territory = result.data;
				}
				this.$message({
					showClose: true,
					message: '获取文章领域分类失败',
					type: 'warning'
				});
			},
			//获取文章类型
			async getArticleType() {
				const {
					data: result
				} = await window.axios.get("/territory/getArticleType");
				if (result.code == 0) {
					return this.articleType = result.data;
				}
				this.$message({
					showClose: true,
					message: '获取文章类型失败',
					type: 'warning'
				});
				this.articleType = [];
			},
			imgUploadSuccess(response, file, fileList){
				this.forms.imgId = file.response.id;
				console.log(file.response);
				this.forms.imgUrl  = file.response.accessPath
				//this.showImg =false;//如果上传了一张新的不然原来的图片显示了
			},
			async fileRemove(file, fileList){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				console.log(result);
			},
			async videoUploadSuccess(response, file, fileList){
				this.forms.videoId = file.response.id;
				console.log(this.forms.videoId);
			},
			async load(){
				
					
					this.content = '';
					this.getArticleType();
					this.getArticleTerritory();
					
					alert('aa=>'+this.forms.id);
					console.log('========11===');
					console.log(this.forms);
					if(this.forms.id!=undefined && this.forms.id!='' ){ 
						
						const articleId = this.$route.query.id;
						const {data:result} = await this.$axios.get('article/getInfo/'+articleId);
						
						if(result.code!=0){
							this.$message.error('获取文章信息失败');
							return;
						}
						
						this.forms = result.data;
						console.log("==========");
						console.log(this.forms);
						this.showImg = true; //查询到图片了把他显示出来
						this.content = result.data.contentMarkdown;
						console.log(this.forms.imgUrl);
						//this.imgList = [{name:'',url:result.data.imgUrl}];
						if(result.data.videoUrl !='' && result.data.videoUrl != undefined){
							//this.videoList = [{name:'',url:result.data.videoUrl}];
							this.forms.videoId = result.data.videoId;
						}
					}
				
			}
			  
		},
		async created() {},
		mounted() {
			this.uploadHeader = {'token':window.localStorage.getItem("token")};
			console.log(this.$refs.md);
			
			
			if(!this.$route.query.update){
				//重置表单
				console.log("重置表单");
				console.log(this.forms.content);
				this.forms ={
					title: '', // 文章标题,
					imgSource: '', //图片来源
					desc: '', //描述
					territoryId: '', //领域id
					productId: '', // 产品id
					articleType: '', //产品分类 成功案例| 媒体报道
					content: '', //文章正文
					imgId:'',
					videoId:'',
					html:''
				}
				console.log(this.forms);
				this.showImg=false; //不让图片显示
			}else{
				this.forms.id = this.$route.query.id;
				this.load();
			}
			console.log("=====mounted=====");
			console.log(this.$route.query.update);
			
		},
		watch: {
			 'forms.territoryId': async function(territoryId) { //当选择了 领域 获取领域的产品
				
				const {
					data: result
				} = await this.$axios.get("/territory/getProducts?territoryId=" + territoryId);
				if (result.code == 0) {
					if (result.data.length <= 0) { //如果查询不到数据设置为空
						this.forms.productId = '';
						return this.product = result.data;
					}
					
					this.product = result.data;
					//为了防止 第一次初始化的时候 产品id 会强制标为 第一个选项
					if(territoryId != this.forms.territoryId){
						this.forms.productId = result.data[0].id;
					}
					
					return this.product = result.data;
				}
				this.$message({
					showClose: true,
					message: '获取文章领域分类失败',
					type: 'warning'
				});
			}
			
		}
	}
</script>

<style scoped>

</style>
