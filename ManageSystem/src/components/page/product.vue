<template>
	<div>
<!-- 弹出层 -->
		<el-dialog :before-close="handleClose" :title="currentProduct.name" :visible.sync="dialogFormVisible" width='80%' :close-on-click-modal="false">
			
			产品名称: <el-input v-model="currentProduct.name" placeholder="请输入内容" style="width: 200px;"></el-input>
			
			<el-divider content-position="left" >系统概述</el-divider>
			<el-input style="font-weight: 800; font-size: 15px; margin-bottom: 20px;" type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"  v-model="currentProduct.summarize">
			</el-input>
			
			
			<el-divider content-position="left" >系统特点</el-divider>
			<el-checkbox-group v-model="currentProduct.features" >
				<el-checkbox :label="item.id" v-for="item in features" :key='item.id'  style="margin-bottom: 20px;">{{item.name}}</el-checkbox>
			</el-checkbox-group>
			
			
			<el-divider content-position="left" >系统功能</el-divider>
			
			<div v-for="(item,index) in currentProduct.functions" style="text-align: left;">
				<span style="font-size: 15px;margin-right: 10px; width: 20%;">{{item.title}}:</span>
				<el-input v-model="item.content" placeholder="请输入内容" style="width: 60%;margin-bottom: 10px; margin-right: 10px;" @keyup.enter.native='addFunction()'></el-input> <!--  @blur='updateFunction(item)'-->
				
				<el-tooltip class="item" effect="dark" content="删除" placement="top">
					<el-button type="danger" icon="el-icon-delete" circle  size="mini" @click='delFunction(item.id)'></el-button>
				</el-tooltip>
				
				<el-tooltip class="item" effect="dark" content="修改功能名" placement="right" style="margin-right: 50px;">
					<el-button type="primary" icon="el-icon-edit-outline" circle  size="mini" @click="updateFunctionName(item)"></el-button>
				</el-tooltip>
				
			</div>
			
			
			<el-divider content-position="left" >系统优势   <el-button style="margin-left:200px;" @click='addAdvantage()'>添加</el-button> </el-divider>
			
			<div v-for="(item,index) in currentProduct.advantages" style="text-align: left;">
				<span style="font-size: 15px;margin-right: 10px; width: 20%;">{{item.title}}:</span>
				<el-input v-model="item.content" placeholder="请输入内容" style="width: 60%;margin-bottom: 10px; margin-right: 10px;" @keyup.enter.native='addAdvantage()'></el-input> <!--  @blur='updateFunction(item)'-->
				
				<el-tooltip class="item" effect="dark" content="删除" placement="top">
					<el-button type="danger" icon="el-icon-delete" circle  size="mini" @click='delAdvantage(item.id)'></el-button>
				</el-tooltip>
				
				<el-tooltip class="item" effect="dark" content="修改优势名" placement="right" style="margin-right: 50px;">
					<el-button type="primary" icon="el-icon-edit-outline" circle  size="mini" @click="updateAdvantagenName(item)"></el-button>
				</el-tooltip>
				
			</div>
			
			
			
			
			
			
			
			
			<el-divider content-position="left" >产品页顶部展示图片</el-divider>
			 <el-image :src="currentProduct.headImgUrl" v-if='currentProduct.headImgUrl==undefined?false:(currentProduct.headImgUrl.length>5)'></el-image>
			 
			<el-upload
				ref='ImgUpload'
				:limit="1"
				:list-type="'picture'"
				:before-remove="fileRemove"
			    class="upload-demo"
			    drag
				:file-list="iconList2"
				accept=".jpg,.png,.jpeg,.JPG,.JPEG"
			    :action="$axios.defaults.baseURL+'/file/uploadImg'"
			     :on-success='imgUploadSuccess'  :headers="uploadHeader" :multiple='false'>
			    <i class="el-icon-upload"></i>
			    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
			
			<el-divider content-position="left" >产品图片</el-divider>
			 <el-image :src="currentProduct.systemImgUrl" v-if='currentProduct.systemImgUrl==undefined?false:(currentProduct.systemImgUrl.length>5)'></el-image>
			 
			<el-upload
				ref='ImgUpload'
				:limit="1"
				:list-type="'picture'"
				:before-remove="fileRemove"
				:file-list="iconList"
			    class="upload-demo"
			    drag
				accept=".jpg,.png,.jpeg,.JPG,.JPEG"
			    :action="$axios.defaults.baseURL+'/file/uploadImg'"
			    :on-success='imgUploadSuccess2'  :headers="uploadHeader" :multiple='false'>
			    <i class="el-icon-upload"></i>
			    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
			
			
			
			<div slot="footer" class="dialog-footer" >
				<el-button @click="handleClose()">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</div>
			
		</el-dialog>

<!-- 弹出层结束 -->


		<el-row :gutter="24">
			<el-col :span="24">

				<el-form :model="forms" ref="ruleForm" label-width="100px" :inline="true">

					<el-form-item label="产品名称" prop="name">
						<el-input v-model="forms.name"></el-input>
					</el-form-item>

					<el-form-item label="所属领域" prop="name">

						<el-select v-model="forms.territoryId" placeholder="请选择">
							<el-option :key="0" label="查询所有" :value="0"></el-option>
							<el-option v-for="item in territory" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item label="产品分类" prop="name">
						<el-select v-model="forms.productId" placeholder="请选择">
							<el-option :key="0" label="查询所有" :value="0"></el-option>
							<el-option v-for="item in pro" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='addProduct()'>新增</el-button>
				</el-form>
			</el-col>
		</el-row>


		<el-row :gutter="24">

			<el-col :span="8" v-for=" item in product" style="height: 350px;">

				<el-card class="box-card" style="margin-bottom: 20px;" :class="{'blur1':item.status==1?true : item.indexs}" >
					
					<div slot="header" class="clearfix" >
						<span v-text="item.name"></span>

						<span style="margin-left: 20px;" v-if="item.indexIsshow==0">
							<el-link :underline="false">首页展示</el-link>
						</span>
					</div>
					
					<div >
						<div class="block" style="height: 200px; " >
							<!-- http://127.0.0.1:8765///image/3d45c-chanpin2.png -->
							<el-image :src="item.headImgUrl" :preview-src-list="item.productImgUrl" style='height:160px;'></el-image>
							<div style="text-align: right;">
								<el-tooltip class="item" effect="dark" content="编辑" placement="top">
									<el-button type="success" icon="el-icon-edit-outline" circle @click='show(item.id)'></el-button>
								</el-tooltip>

								<el-tooltip class="item" effect="dark" content="禁用" placement="top" v-if='item.status==0'>
									<el-button type="warning" icon="el-icon-close" circle  @click="updateProductStatus(item.id,1)"></el-button>
								</el-tooltip>
								
								<el-tooltip class="item" effect="dark" content="启用" placement="top" v-if='item.status==1'>
									<el-button type="warning" icon="el-icon-check" circle @click="updateProductStatus(item.id,0)"></el-button>
								</el-tooltip>

								<el-tooltip class="item" effect="dark" content="删除" placement="top">
									<el-button type="danger" icon="el-icon-delete" circle @click='deleteProduct(item.id)'></el-button>
								</el-tooltip>

							</div>
						</div>
					</div>
					
				</el-card>

			</el-col>

		</el-row>

	</div>

	</div>
</template>

<script>
	var datas = {
		forms: {
			name: '',
			territoryId: '' ,//领域id
			productId:'' //产品分类
		},
		territory: [],
		product: [],
		pro:[], //产品分类,后台获取
		dialogFormVisible:false, // 弹出层是否显示,
		update:false,//是否为修改
		currentProduct:{}, // 当前的产品
		features:[], //系统功能
		uploadHeader:{'token':window.localStorage.getItem("token")}, //图片上传携带token
		iconList:[],
		iconList2:[],
	}
	export default {
		data: () => datas,
		methods: {
			async getData() {
				const {
					data: result
				} = await this.$axios.get('/product/get', {
					params: this.forms
				});
				
				if (result.code == 0) {
					this.product = result.data;
				} else {
					this.$message.error("获取产品信息失败");
				}

			},
			async getTerritory() { //获取所有领域信息
				const {
					data: result
				} = await this.$axios.get("/territory/getTerritory");
				
				if (result.code == 0) {
					this.territory = result.data;
				}
			},
			async getFeatures(){
				const {data:result} = await this.$axios.get("/product/features");
				if(result.code == 0 ){
					 this.features = result.data;
					 return;
				}
				this.$message.error("获取产品功能失败");
				
			},
			
				//通过productId 获取产品详情
			 async getProductInfo(productId){
				var {data:result}  = await this.$axios.get("product/get/"+productId);
				console.log(result);
				if(result.code == 0)  return result.data;
				return null;
			},
			
			async show(productId){
				this.iconList =[];
				this.iconList2 =[];
				this.currentProduct  = await this.getProductInfo(productId);
				
				this.dialogFormVisible =true;
				this.update = true;
			},
			addFunction(functions){
				var _this = this;
				this.$prompt('给产品添加一个功能描述', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then( async ({ value }) => {
							if(value.trim() == '' ){
								return;
							}
							console.log(value);
							const {data:result} = await _this.$axios.post("/product/function/add",{
								content:'',
								id:null,
								productInfoId:this.currentProduct.id,
								sort:0,
								status:0,
								title: value
							});

							if( result.code ==0 ){
							 _this.currentProduct.functions.push(result.data);
							}else{
								_this.$message.error("添加失败");
							}
							
						 
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消添加'
				          });       
				        });
			},
			addAdvantage(functions){
				var _this = this;
				this.$prompt('给产品添加一个功能描述', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then( async ({ value }) => {
							if(value.trim() == '' ){
								return;
							}
							console.log(value);
							const {data:result} = await _this.$axios.post("/product/advantage/add",{
								content:'',
								id:null,
								productInfoId:this.currentProduct.id,
								sort:0,
								status:0,
								title: value
							});

							if( result.code ==0 ){
								if( !_this.currentProduct.advantages){
									_this.currentProduct.advantages =[];
								}
							 _this.currentProduct.advantages.push(result.data);
							}else{
								_this.$message.error("添加失败");
							}
							
						 
				        }).catch((e) => {
							console.log(e);
				          this.$message({
				            type: 'info',
				            message: '取消添加'
				          });       
				        });
			},
			/* async updateFunction(functionObj){
				const {data:result} = await this.$axios.post("/product/function/update",functionObj);
				console.log(result);
				if(result.code == 0){
					this.$message.success("功能描述修改成功");
				}
				
			}, */
			delFunction(functionId){
				if(this.currentProduct.functions.length <=1 ){
					this.$message.warning("请保留至少一个功能")
					return;
				}
				var _this = this;
				this.$confirm('确定删除此功能?', '标题名称', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  callback: async action => {
					const {data:result} = await _this.$axios.post("/product/function/delete/"+functionId);
					if(result.code == 0){
						_this.$message.success("删除成功");
						const index = _this.currentProduct.functions.findIndex(o => o.id == functionId);
						_this.currentProduct.functions.splice(index, 1);
					}else{
						_this.$message.error("删除失败");
					}
				  }
				});
			},
			delAdvantage(functionId){
				if(this.currentProduct.functions.length <=1 ){
					this.$message.warning("请保留至少一个优势")
					return;
				}
				var _this = this;
				this.$confirm('确定删除此优势?', '标题名称', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  callback: async action => {
					const {data:result} = await _this.$axios.post("/product/advantage/delete/"+functionId);
					if(result.code == 0){
						_this.$message.success("删除成功");
						const index = _this.currentProduct.advantages.findIndex(o => o.id == functionId);
						_this.currentProduct.advantages.splice(index, 1);
					}else{
						_this.$message.error("删除失败");
					}
				  }
				});
			},
			updateFunctionName(functions){
				var _this = this;
				this.$prompt('修改功能名称', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then( async ({ value }) => {
							if(value.trim() == '' ){
								return;
							}
							console.log(value);
							const {data:result} = await _this.$axios.post("/product/function/update",{
								'title': value,
								id:functions.id
							});
				
							if( result.code ==0 ){
								console.log();
							 functions.title = value;
							 
							}else{
								_this.$message.error("修改失败");
							}
							
						 
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消添加'
				          });       
				        });
			},
			updateAdvantagenName(functions){
				var _this = this;
				this.$prompt('修改优势名称', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then( async ({ value }) => {
							if(value.trim() == '' ){
								return;
							}
							console.log(value);
							const {data:result} = await _this.$axios.post("/product/advantagen/update",{
								'title': value,
								id:functions.id
							});
							
							if( result.code ==0 ){
								console.log();
							 functions.title = value;
							 
							}else{
								_this.$message.error("修改失败");
							}
							
						 
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消添加'
				          });       
				        });
			},
			imgUploadSuccess(response, file, fileList){
				
				this.currentProduct.headImgUrl = file.response.accessPath;
				this.currentProduct.headImg = file.response.id;
			},
			imgUploadSuccess2(response, file, fileList){
				
				console.log(response);
				console.log(file);
				console.log(fileList);
				console.log(this.currentProduct);
				
				this.currentProduct.systemImgUrl = file.response.accessPath;
				this.currentProduct.systemImg = file.response.id;
				console.log(this.currentProduct.systemImg);
			},
			async fileRemove(file, fileList){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				console.log(result);
			},
			 async submitForm(){
				//this. dialogFormVisible = false;
				console.log(this.currentProduct);
				const {data:result} = await this.$axios.post("/product/update",this.currentProduct);
				if(result.code == 0){
					this.$message.success("修改成功");
					this.dialogFormVisible = false;
					this.getData();
				}
				this.$refs.ImgUpload.clearFiles();
				
			},
			async addProduct(){
				this.iconList =[];
				this.iconList2 =[];
				// if(this.forms.productId=='' || this.forms.productId<=0){
				// 	this.$message.warning("请选择产品分类!");
				// 	return;
				// }
				
				const {data:result} = await this.$axios.post("/product/add?productId="+this.forms.productId);
				if(result.code == 0){
					this.show(result.data);
				}else{
					this.$message.error("添加失败!");
				}
				
			},
			async deleteProduct(productId){
				var _this = this;
				this.$confirm('确定删除此产品?', '标题名称', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  callback: async action => {
					const {data:result} = await _this.$axios.post("/product/delete/"+productId);
					if(result.code == 0){
						_this.$message.success("删除成功");
						_this.getData();
					}else{
						_this.$message.error("删除失败");
					}
				  }
				});
				
			},
			//修改产品状态
			async updateProductStatus(productId,status){
				const {data:result} = await this.$axios.post("/product/updateStatus?productId="+productId+"&status="+status);
				if(result.code == 0){
					this.$message.success(status==0?"启用成功":"禁用成功");
					this.getData();
				}else{
					this.$message.error(status==0?"启用失败":"禁用失败")
				}
					
			},
			async handleClose(done){
				this.$axios.post("/product/clean");
				this.dialogFormVisible = false;
				done();
			}
		},
		created() {
			this.getData();
			this.getTerritory();
			this.getFeatures();
		

		},
		mounted(){
			this.uploadHeader = {'token':window.localStorage.getItem("token")}
		},
		watch: {
			'forms.territoryId': async function(newVal) {
				console.log(newVal);
				const {data:result} =  await this.$axios.get("/product/getType/"+newVal);
				console.log(result);
				this.pro = result.data;
				if(result.data.length ==0){
					this.forms.productId =0;
				}
				
				this.getData();
			},
			'forms.productId':async function(newVal) {
				this.getData();
			},
			'forms.name': function(newVal) {
				this.getData();
			},
			'currentProduct.features':function(newVal){
				console.log(newVal);
			},
			'currentProduct.functions':function(newVal){
				console.log(newVal);
			}
		}
	};
</script>

<style>
	.blur1 {
		background-color: lavender;
	}
</style>
