<template>
	<div>
		
		
		<!-- 弹出层 -->
		
		<el-dialog title="编辑" :visible.sync="dialogTableVisible" width="70%" :close-on-click-modal="false"  :modal='true'>
			<div>
				<span style="margin-right: 10px;">资料名称:</span>
				<el-input v-model="resourceObj.name" placeholder="请输入资料名称" style="width: 300px;"></el-input>
				
				
				<span style="margin-right: 10px;margin-left: 100px;">所属类型:</span>
				<el-select v-model="resourceObj.typeId" placeholder="请选择领域">
					<el-option v-for="item in questionType" :label="item.name" :value="item.id"></el-option>
				</el-select>
				
				<br/>
				<br/>
				
				<span style="margin-right: 10px;margin-left: 25px;">描述:</span>
				<el-input type="textarea" v-model="resourceObj.desc" placeholder="请输入描述信息" style="width: 300px;"></el-input>
				
			</div>
			 
				<div style="width: 40%; margin-top: 20px;" >
					<el-upload
					  :on-remove="handleRemove"
					  multiple
					  class="upload-demo"
					  :headers="uploadHeader"
					  :data="{'type':5}"
					  :limit="1"
					  :action="$axios.defaults.baseURL+'/file/upload'"
					  :on-exceed="handleExceed"
					  :file-list="fileList" 
					  list-type="text"
					  :on-success="uploadSuccess">
					  <el-button  type="primary">点击上传资料</el-button>
					  </el-upload>
				</div> 
			
			<div slot="footer" class="dialog-footer">
			      <el-button @click="dialogTableVisible = false">取消</el-button>
			      <el-button type="primary" @click='submitResource'>确定</el-button>
		    </div>
					
			
			
		</el-dialog>
		
		<!-- 弹出层结束 -->
		
		

		<!-- 资料下载 -->
		<el-card class="box-card" shadow="hover" style="height: 60px;">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="文章名">
					<el-input v-model="forms.name" placeholder="文章名" style="width: 160px;"></el-input>
				</el-form-item>

				<el-form-item label="分类">
					<el-select v-model="forms.typeId" placeholder="请选择领域" style="width: 120px;">
						<el-option label="所有" :value="0"></el-option>
						<el-option v-for="item in questionType" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item style="margin-left: 0px;">
					<el-button round type="primary" icon="el-icon-circle-plus" @click="showDialogTable">新增</el-button>
					 <el-button type="warning" round icon="el-icon-error" @click='updateStatus(selectIds,1)'>禁用</el-button>
					<el-button type="success" round icon="el-icon-success" @click='updateStatus(selectIds,0)'>启用</el-button> 
					<el-button type="danger" round icon="el-icon-delete" @click="deleteResource(selectIds)">删除</el-button>
				</el-form-item>
				
				
			</el-form>
		</el-card>



		<!-- 底部表格-->
		<el-card class="box-card" shadow="hover">
			<el-table :data="tableData" height="400" border style="width: 100%;height: 400px; font-size: 12px;" :row-class-name="tableowColor"
			 @selection-change="selectChange($event)">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column fixed prop="id" label="编号" width="60">
				</el-table-column>
				<el-table-column prop="name" label="资料名" width="200">
				</el-table-column>
				<el-table-column prop="desc" label="描述" width="160">
				</el-table-column>

				<el-table-column prop="typeName" label="所属分类" width="160">
				</el-table-column>

				<el-table-column prop="createTime" label="上传时间" width="150">
				</el-table-column>
				
				<el-table-column prop="sort" label="排序" width="100" sortable>
				</el-table-column>
				
				<el-table-column label="下载地址" width="160">
					<template slot-scope="scope">
						<el-link type="primary" :href='scope.row.downloadUrl'>{{scope.row.downloadUrl==undefined?"无文件":"点击下载"}}</el-link>
					</template>
				</el-table-column>
				
				<el-table-column fixed="right" label="操作" width="200">
					<template slot-scope="scope" style="text-align: center;margin-left: 50px;">
						<el-button @click="updateSort(scope.row)" type="text" size="small">排序</el-button>
						<el-button type="text" size="small" @click="updateResource(scope.row)">编辑</el-button>
						<el-tooltip :content="scope.row.status==0?'点击禁用':'点击启用'" placement="top">
							<el-switch label="状态" :value="scope.row.status==0" @change="switchChange($event,scope.row)">
							</el-switch>
						</el-tooltip>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" circle style="margin-left: 30px;" @click='deleteResource([scope.row.id])'></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>


		<!-- 底部分页 -->
		<div class="block" style="text-align: right;margin-top: 20px;">
			<el-pagination :current-page='forms.pageNum' :page-sizes="[5, 10, 15, 20]" :page-size="forms.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" @size-change="onPageSizeChange" @current-change="onPageNumChange">
			</el-pagination>
		</div>

	</div>

</template>
<script>
	var datas = {
		forms: {
			name: '',
			typeId: '',
			pageNum: 1,
			pageSize: 5
		},
		uploadHeader:{'token':window.localStorage.getItem("token")},
		resourceObj:{
			id:'',
			name : '',
			desc :'',
			fileId : '', //文件id
			typeId: ''  //分类id
		},
		dialogTableVisible:false, //弹出层展示
		questionType: [], //问题类型list
		tableData: [],
		total: 0,
		selectIds:[], //表格内被选中的id
		fileList:[], //上传文件的数组
		handleExceed(){ //上传文件超过限制回调
			this.$message.warning("最多只能上传一个资源");
		},
	}


	export default {
		data: () => datas,
		methods: {
			async getData() {
				const {
					data: result
				} = await this.$axios.get('/resource/get', {
					params: this.forms
				});
				console.log(result);
				this.tableData = result.data.list;
				this.total = result.data.total;
				console.log(this.tableData);
			},
			async getQuestionType() {
				const {
					data: result
				} = await this.$axios.get("/resource/getQuestionType");
				if (result.code == 0) {
					this.questionType = result.data;
				}
			},
			//当PageNum发生改变
			onPageNumChange(val) {
				this.forms.pageNum = val;
			},
			//当PageSize发生改变
			onPageSizeChange(val) {
				this.forms.pageSize = val;
			},
			tableowColor({
				row,
				rowIndex
			}) {
				if (row.status != 0) {
					return 'warning-row';
				}
			},
			//表格数据事件 当选中表格内的单选框时 将id保存
			selectChange(data){
				if(data.length>0){
					var idList = data.map(data=> data.id);
					this.selectIds = idList;
				}
			},
			//表格内开关切换回调
			async switchChange(val,row){
				row.status = val?0:1;  //status 
				var id = row.id; //id 
				const comitData = {'id':id,'status':row.status};
				
				this.updateStatus([id],row.status);
				
				console.log(comitData);
			},
			async updateStatus(idList,status){
				var param = {
					'idList':idList,
					'status':status
				}
				const {data:result} = await this.$axios.post("/resource/updateStatus",param);
				console.log(result);
				if(result.code == 0 ){
					this.$message.success(status==1?'禁用成功':'启用成功');
					
					if(idList.length>0){
						this.getData();
					}
				}
			},
		 deleteResource(idList){
			var _this = this;
			this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then( async () => {
			          
					  const {data:result} = await _this.$axios.post("/resource/delete",idList);
					  if(result.code == 0){
					  	_this.$message.success("删除成功");
						this.getData();
					  }
					  
		   })
		},
		async handleRemove(file, fileList ){
			console.log(file);
			console.log(fileList);
			const id = file.response.id; //获取 id
			const {data:result} = await this.$axios.post("/file/delete",[id]);
			console.log(result);
			this.indexIcon = '';
		},
		uploadSuccess(response, file, fileList){
			const fileId = file.response.id;
			this.resourceObj.fileId = fileId;
		},
		//展示弹出层
		showDialogTable(){
			this.resourceObj = {
				name : '',
				desc :'',
				file_id : '',
			};
			this.dialogTableVisible = true;
		},
		async submitResource(){
			console.log(this.resourceObj);
			const {data:result} = await this.$axios.post("/resource/addOrUpdate",this.resourceObj);
			console.log(result);
			if(result.code == 0){
				this.$message.success(this.resourceObj.id == undefined ? "添加成功!" : "修改成功!");
				this.resourceObj = {
						id:'',
						name : '',
						desc :'',
						fileId : '', //文件id
						typeId: ''  //分类id
					};
					this.fileList = [];
				this.dialogTableVisible = false;
				this.getData();
			}
		},
		async updateResource(row){
			const id = row.id ;
			console.log(id);
			const {data:result} = await this.$axios.get("resource/get/"+id);
			console.log(result);
			if(result.code == 0){
				this.resourceObj = result.data;
				this.fileList.push({
					"name":result.data.filename,
					"url":result.data.downloadUrl
				});
				this.dialogTableVisible = true;
			}else{
				this.$message.error("获取信息失败!");
			}
			
			
		},
		updateSort(row) {
			var _this = this;
			this.$prompt('修改排序', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^(\-|\+)?\d*$/,
				inputErrorMessage: '必须输入数字'
			}).then(async ({
				value
			}) => {
				console.log(value);
				const {
					data: result
				} = await _this.$axios.post('/resource/updateSort?id=' + row.id + "&sort=" + value);
				if (result.code == 0) {
					_this.$message.success("排序修改成功!");
					_this.getData(); //重新查询
				}
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '取消输入'
				});
			});
		}
			
		},
		created() {

		},
		watch:{
			'forms.pageNum':function(newVal){
				this.getData();
			},
			'forms.pageSize':function(newVal){
				this.getData();
			},
			'forms.name':function(newVal){
				this.getData();
			},
			'forms.typeId':function(newVal){
				this.getData();
			}
		},
		mounted() {
			this.getData();
			this.getQuestionType();
		}
	}
</script>
<style >
	
	.el-upload {
		border: 0px;
		width: 100px;
		height: 80px;
	}
</style>
