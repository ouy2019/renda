<template>
	<div>
		<el-form ref="forms" :model="forms" :rules="rules" label-width="100px" :inline="true" style="text-align: center;">
			
			<el-form-item label="轮播图名称" prop="name">
				<el-input v-model="forms.name"  style="width: 200px;"></el-input>
				
			</el-form-item>

			<el-form-item label="描述" prop="desc">
				<el-input v-model="forms.desc" placeholder="人大微信公众平台" style="width: 200px;"></el-input>
			</el-form-item>
			
			<el-form-item label="轮播图类型" prop="type">
				<el-select v-model="forms.type" placeholder="请选择" style="width: 120px;">
				<el-option :value="1" :label="'首页轮播图'">首页轮播图</el-option>
				<el-option :value="2" :label="'成功案例轮头图'">成功案例轮头图</el-option>
				<el-option :value="3" :label="'媒体报道头图'">媒体报道头图</el-option>
				<el-option :value="4" :label="'服务支持头图'">服务支持头图</el-option>
				<el-option :value="5" :label="'关于我们头图'">关于我们头图</el-option>
			  </el-select>
			</el-form-item>
			
			<el-form-item label="跳转路径" prop="url">
				<el-input v-model="forms.url" placeholder="跳转路径" style="width: 200px;"></el-input>
			</el-form-item>

			<br/>

			<div class="block">
			    <el-image :src="imgUrl" v-if='showImg'>
			      <div slot="placeholder" class="image-slot">
			        加载中<span class="dot">...</span>
			      </div>
			    </el-image>
			  </div>
			  
			  
			 <el-form-item label="图片" style="margin-left: -200px;">
				 <el-upload
					:file-list="imgList"
					ref='ImgUpload'
					:limit="1"
					:list-type="'picture'"
					:before-remove="fileRemove"
				    class="upload-demo"
				    drag
					accept=".jpg,.png,.jpeg,.JPG,.JPEG,.gif"
				    :action="this.$axios.defaults.baseURL+'/file/uploadImg'"
				     :on-success='imgUploadSuccess'  :headers="uploadHeader" :multiple='false'>
				    <i class="el-icon-upload"></i>
				    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
				
			</el-form-item> 

			<br/>
			<el-button class="editor-btn" type="primary" @click="submitFrom" style="margin-left: -100px;margin-top: 60px;width: 100px;">提交</el-button>

		</el-form>

	</div>

</template>

<script>

	var datas = {
		forms: {
			id:'',
			name:'',
			url:'',
			desc:'',
			fileId:'',
			type:1
		},
		imgUrl:"",
		uploadHeader:{token:window.localStorage.getItem("token")},
		showImg:false,
		imgList:[],
		rules: {
			name: [{
					required: true,
					message: '请输入轮播图名称',
					trigger: 'blur'
				},
				{
					min: 0,
					max: 999,
					message: '轮播图名称不能为空',
					trigger: 'blur'
				}
			],
			desc: [{
					required: true,
					message: '请输入描述信息',
					trigger: 'blur'
				},
				{
					min: 0,
					max: 999,
					message: '描述信息不能为空',
					trigger: 'blur'
				}
			]
		}
	};
	export default {
		name: 'rotationAdd',
		data: () => datas,
		mounted(){
		},
		async created() {
			this.uploadHeader={token:window.localStorage.getItem("token")};
		},
		
		methods:{
			imgUploadSuccess(response, file, fileList){
				
				this.forms.fileId = file.response.id;
				this.imgUrl = response.accessPath;
				//this.showImg =false;  //如果上传了图片,让原来的图片不显示
				
			},
			async submitFrom(){
				this.$refs.forms.validate(async (valid) => {
					if(valid){
						if(this.forms.fileId==null || this.forms.fileId ==''){
							this.$message.error("请上传一张图片!");
							return;
						}
						if(this.$route.query.update){
							console.log(this.forms);
							var {data : result} = await this.$axios.post("/banner/update",this.forms);
							console.log(result);
						}else{
							var {data:result} =await this.$axios.post("/banner/upload",this.forms);
						}
						
						if(result.code==0){
							if(!this.$route.query.update){
								this.$message.success('轮播图上传成功但出于禁用状态!');
							}else{
								this.$message.success('轮播图修改成功!');
							}
							this.$router.replace("/rotation");
							//重置表单
							this.$refs.forms.resetFields();
							this.$refs.ImgUpload.clearFiles();
							
						}
						
					}else{
						this.$message.error("请完善表单录入!");
					}
				});
				
			},
			async fileRemove(file, fileList){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				this.forms.fileId ='';
			}
		},
		async mounted() {
			if(this.$route.query.update){
				 const {data:result} = await this.$axios.get("/banner/get/"+this.$route.query.id);
				this.forms = result.data;
				this.imgUrl = result.data.imgUrl;
				this.showImg =this.$route.query.update;
			}
		},
		watch: {
			"$route": async function(){
					if(this.$route.query.update){
						 const {data:result} = await this.$axios.get("/banner/get/"+this.$route.query.id);
						this.forms = result.data;
						this.imgUrl = result.data.imgUrl;
						this.showImg =this.$route.query.update;
					}else{
						this.forms = {
							id:'',
							name:'',
							url:'',
							desc:'',
							fileId:'',
							type:1
						};
						this.imgUrl = '';
						this.showImg = false;
					}
			}
		}
	}
</script>

<style scoped>

</style>
