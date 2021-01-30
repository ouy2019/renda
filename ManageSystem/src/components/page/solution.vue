<template>
	<!-- 解决方案 -->
	<div>
		
		
		
		<el-dialog  :title="info.name" :before-close="handleClose" :visible.sync="dialogFormVisible" width='80%' :close-on-click-modal="false">
			
			方案名称: <el-input v-model="info.name" placeholder="请输入内容" style="width: 200px;"></el-input>
			
			<el-divider content-position="left" >解决方案:</el-divider>
			<el-input style="font-weight: 800; font-size: 15px; margin-bottom: 20px;" type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"  v-model="info.introduce">
			</el-input>
			
			
			<el-divider content-position="left" >现状分析</el-divider>
			
			<div v-for="(item,index) in info.analyse" style="text-align: left;">
				<span style="font-size: 15px;margin-right: 10px; width: 20%;">{{item.title}}:</span>
				<el-input v-model="item.content" placeholder="请输入内容" style="width: 60%;margin-bottom: 10px; margin-right: 10px;" @keyup.enter.native='addAnalyse()'></el-input> <!--  @blur='updateFunction(item)'-->
				
				<el-tooltip class="item" v-if="index>0" effect="dark" content="删除" placement="top">
					<el-button type="danger" icon="el-icon-delete" circle  size="mini" @click='delAnalyse(index)'></el-button>
				</el-tooltip>
				
				<el-tooltip class="item" effect="dark" content="修改功能名" placement="right" style="margin-right: 50px;">
					<el-button type="primary" icon="el-icon-edit-outline" circle  size="mini" @click="updateAnalyseName(index)"></el-button>
				</el-tooltip>
				
			</div>
			
			
			<el-divider content-position="left" >系统价值</el-divider>
			
			<div v-for="(item,index) in info.value" style="text-align: left;">
				<span style="font-size: 15px;margin-right: 10px; width: 20%;">{{item.title}}:</span>
				<el-input v-model="item.content" placeholder="请输入内容" style="width: 60%;margin-bottom: 10px; margin-right: 10px;" @keyup.enter.native='addValue()'></el-input> <!--  @blur='updateFunction(item)'-->
				
				<el-tooltip class="item" v-if="index>0" effect="dark" content="删除" placement="top">
					<el-button type="danger" icon="el-icon-delete" circle  size="mini" @click='delValue(index)'></el-button>
				</el-tooltip>
				
				<el-tooltip class="item" effect="dark" content="修改功能名" placement="right" style="margin-right: 50px;">
					<el-button type="primary" icon="el-icon-edit-outline" circle  size="mini" @click="updateValueName(index)"></el-button>
				</el-tooltip>

			</div>
			
			
			<el-image v-if='dislogUpdate'
			      style="width: 100px; height: 100px"
			      :src="info.imgUrl"
			      ></el-image>
			<el-upload
				ref='ImgUpload'
				:limit="1"
				:list-type="'picture'"
				:before-remove="fileRemove"
			    class="upload-demo"
				:file-list='fileList'
			    drag
				accept=".jpg,.png,.jpeg,.JPG,.JPEG"
			    :action="$axios.defaults.baseURL+'/file/uploadImg'"
			     :on-success='imgUploadSuccess'  :headers="uploadHeader" :multiple='false'>
			    <i class="el-icon-upload"></i>
			    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
			
			
			<div slot="footer" class="dialog-footer" >
				<el-button @click="handleClose()">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</div>

		</el-dialog>
		
		
		
		
		
		
		
		
		
		
		<el-row :gutter="24">
		
			<el-col :span="24" style="height: 350px;">
		
				<el-card class="box-card" style="margin-bottom: 20px;"  >
					
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
					
						<el-button type="primary" @click='add()'>新增</el-button>
					</el-form>
					
				</el-card>
		
		
				<el-card class="box-card" style="margin-bottom: 20px;"  >
					
					
					<el-table
					    :data="tableData"
					    border
					    style="width: 100%">
						
					    <el-table-column
					      prop="name"
					      label="方案名称"
					      width="200">
					    </el-table-column>
						
					    <el-table-column
					      prop="introduce"
					      label="描述"
					      width="700">
					    </el-table-column>
						
					    <el-table-column  label="功能">
							
						<template slot-scope="scope">
						        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
								
								<el-tooltip :content="scope.row.ismenu==0?'不显示在菜单':'显示在菜单'" placement="top">
									<el-switch  label="状态"  :value ="scope.row.ismenu==1"  @change="switchChange($event,scope.row)" >
									</el-switch>
								</el-tooltip>
								&nbsp;&nbsp;&nbsp;
								<el-tooltip :content="scope.row.status==0?'不显示在主页':'显示在主页'" placement="top">
									<el-switch  label="状态"  :value ="scope.row.status==0"  @change="switchChange2($event,scope.row)" >
									</el-switch>
								</el-tooltip>
								
						       <el-button style="margin-left: 20px;" type="danger" @click='deleteSolution(scope.row.id)' icon="el-icon-delete"  size="small" ></el-button>
						      
							  <el-link type="primary" style="margin-left: 20px;" @click="$router.push('/solutionManager/'+scope.row.id)">查看详情</el-link>
							  
							  </template>
							  
							  
							  
						    </el-table-column>
						
					    </el-table-column>
						
					  </el-table>
					
				</el-card>
		
		
			</el-col>
		
		</el-row>
		
	</div>
</template>

<script>
	var vueData = {
		forms: {
			name: '',
			territoryId: '' ,//领域id
			productId:'', //产品分类
			type:''
		},
		info:{
			id:'',
			name:'',
			introduce:'',
			introduceImg:'',
			analyse:[{title:'初始化分析',content:'初始化分析内容'}],
			value:[{title:'初始化分析',content:'初始化分析内容'}],
			productId:'',
			type:'',
			imgUrl:''
		},
		territory:[],
		pro:[],
		dialogFormVisible : false,
		uploadHeader:{'token':window.localStorage.getItem("token")},
		fileList:[],
		tableData:[],
		dislogUpdate:false
	}
	
	
	export default{
		data:()=>vueData,
		mounted(){
			console.log(this.$route.params.id);
			this.getTerritory();
			this.uploadHeader =  {'token':window.localStorage.getItem("token")};
			this.getTableData();
			this.forms.type = this.$route.params.id;
		},
		methods:{
			async getTerritory() { //获取所有领域信息
				const {
					data: result
				} = await this.$axios.get("/territory/getTerritory");
				
				if (result.code == 0) {
					this.territory = result.data;
				}
			},
		
			//添加解决方案
			async add(){
				if(this.forms.productId==null || this.forms.productId==''){
					this.$message.error("请选择产品后添加");
					return;
				}
				
				this.info.productId = this.forms.productId;
				this.dialogFormVisible = true;
				this.dislogUpdate=false;
			},
			addAnalyse(){
				var _this = this;
				this.$prompt('添加一个分析', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				}).then( async ({ value }) => {
					if(value.trim() == '' ){
						return;
					}
					console.log(value);
				 this.info.analyse.push({'title':value,'content':''});
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '取消添加'
				  });       
				});
				
			},
			delAnalyse(index){
				
				this.info.analyse.splice(index,1);
			},
			updateAnalyseName(index){
				var _this = this;
				this.$prompt('修改分析名称', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				}).then( async ({ value }) => {
					if(value.trim() == '' ){
						return;
					}
					console.log(value);
				 this.info.analyse[index].title=value;
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '取消添加'
				  });       
				});
			},
			addValue(){
				var _this = this;
				this.$prompt('添加一个分析', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				}).then( async ({ value }) => {
					if(value.trim() == '' ){
						return;
					}
					console.log(value);
				 this.info.value.push({'title':value,'content':''});
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '取消添加'
				  });       
				});
				
			},
			delValue(index){
				this.info.value.splice(index,1);
			},
			updateValueName(index){
				var _this = this;
				this.$prompt('修改分析名称', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				}).then( async ({ value }) => {
					if(value.trim() == '' ){
						return;
					}
					console.log(value);
				 this.info.value[index].title=value;
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '取消添加'
				  });       
				});
			},
			async fileRemove(file, fileList){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				console.log(result);
			},
			imgUploadSuccess(response, file, fileList){				
				this.info.introduceImg = file.response.id;
			},
			async submitForm(){
				
				
				if(this.dislogUpdate){
					console.log(this.info);
					var result = await this.$axios.post("/solution/updateInfo",this.info);
					if(result.data.code==0){
						this.$message.success("修改成功");
						this.dialogFormVisible = false;
						this.info = {
								id:'',
								name:'',
								introduce:'',
								introduceImg:'',
								analyse:[{title:'初始化分析',content:'初始化分析内容'}],
								value:[{title:'初始化分析',content:'初始化分析内容'}],
								productId:'',
								type:this.$route.params.id
						};
						this.fileList = [];
						this.getTableData();
						this.dislogUpdate = false;
					}
					return;
				}
				
				this.info.productId = this.forms.productId;
				this.info.type = this.$route.params.id;
				console.log(this.info);
				
				var result = await this.$axios.post("/solution/addInfo",this.info);
				if(result.data.code==0){
					this.$message.success("添加成功");
					this.dialogFormVisible = false;
					this.info = {
							id:'',
							name:'',
							introduce:'',
							introduceImg:'',
							analyse:[{title:'初始化分析',content:'初始化分析内容'}],
							value:[{title:'初始化分析',content:'初始化分析内容'}],
							productId:'',
							type:this.$route.params.id
					};
					this.fileList = [];
					this.getTableData();
				}
				this.dislogUpdate =false;
			},
			handleClose(){
				this.info = {
						id:'',
						name:'',
						introduce:'',
						introduceImg:'',
						analyse:[{title:'初始化分析',content:'初始化分析内容'}],
						value:[{title:'初始化分析',content:'初始化分析内容'}],
						productId:''
					};
				this.dialogFormVisible = false;	
				this.fileList = [];
			},
			async getTableData(){
				var data = await this.$axios.get('/solution/getInfoList',{params:this.forms});
				this.tableData = data.data.data;
			},
			async deleteSolution(id){
				this.$confirm('此操作将永久删除该方案, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
							var data = await this.$axios.post("/solution/deleteInfo/"+id);
							if(data.data.code==0){
								this.$message.success("删除成功");
								this.getTableData();
							}else{
								this.$message.error("删除失败");
							}
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });	
			},
			edit(data){
				this.info =data;
				console.log(data);
				console.log(data.value);
				console.log(data.analyse);
				this.info.value = JSON.parse(data.value);
				this.info.analyse = JSON.parse(data.analyse);
				this.dialogFormVisible = true;
				this.dislogUpdate = true;
			},
			
			async switchChange($event,row){
				const status = row.ismenu==1?0:1;
				//调用接口 禁用或启用 submit
				const {data:result} = await this.$axios.get("/solution/updateStatus?id="+row.id+"&status="+status);
				console.log(result);
				if(result.code==0){
					this.$message.success($event?'启用成功!':"禁用成功!");
					row.ismenu = $event?1:0;
				}else{
					this.$message.warning($event?'启用失败!':"禁用失败!");
				}
			},
			async switchChange2($event,row){
				const status = row.status==1?0:1;
				//调用接口 禁用或启用 submit
				const {data:result} = await this.$axios.get("/solution/updateStatus2?id="+row.id+"&status="+status);
				console.log(result);
				if(result.code==0){
					this.$message.success($event?'启用成功!':"禁用成功!");
					row.status = $event?0:1;
				}else{
					this.$message.warning($event?'启用失败!':"禁用失败!");
				}
			}
		},
		watch:{
			'forms.territoryId': async function(newVal) {
				console.log(newVal);
				const {data:result} =  await this.$axios.get("/product/getType/"+newVal);
				console.log(result);
				this.pro = result.data;
				if(result.data.length ==0){
					this.forms.productId =0;
				}
				
				this.getTableData();
			},
			'forms.productId':async function(newVal) {
				this.getTableData();
			},
			'forms.name': function(newVal) {
				this.getTableData();
			},
		}
	}
</script>

<style>
</style>
