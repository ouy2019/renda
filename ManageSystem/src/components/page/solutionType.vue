<template>
	<div>
<!-- 弹出层 -->
		<el-dialog
		  title="编辑"
		  :visible.sync="dialogVisible"
		  width="50%"
		  :before-close="handleClose">
		  
		  
			<el-form :inline="true" :model="uploadData" class="demo-form-inline">
				
			  <el-form-item label="方案名称">
			    <el-input v-model="uploadData.name" placeholder="方案名称"></el-input>
			  </el-form-item>
			  <el-form-item label="方案名称">
			    <el-input v-model="uploadData.title" placeholder="方案名称"></el-input>
			  </el-form-item>
			  
			  <br/>
			  <el-form-item label="方案描述">
			    <el-input type="textarea"  style="width: 600px;" :autosize="{ minRows: 6, maxRows: 6}" v-model="uploadData.desc" placeholder="方案描述"></el-input>
			  </el-form-item>
			
			  <div style="width: 40%; margin-top: 20px;" >
			  	<el-upload
			  	  :headers="uploadHeader"
			  	  :on-remove="handleRemove"
			  	  multiple
			  	  :limit="1"
			  	   accept=".jpg,.png,.jpeg,.JPG,.JPEG"
			  	   :action="$axios.defaults.baseURL+'/file/uploadImg'"
			  	  :on-exceed="handleExceed"
			  	  :file-list="iconList"
			  	  list-type="picture"
			  	  :on-success="iconUploadSuccess">
			  	  <el-button  type="primary">点击上传icon图标</el-button>
			  	  </el-upload>
			  </div>
			  
			</el-form>



		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addType()">确 定</el-button>
		  </span>
		</el-dialog>
		
<!-- 弹出层结束 -->		
		
		
		
		
		
		
		
		
		
		
		<el-row :gutter="24">
			<el-col :span="24">
				<el-card class="box-card">
					<el-form :inline="true" :model="forms" class="demo-form-inline">
						
					  <el-form-item label="方案名称">
					    <el-input v-model="forms.name" placeholder="方案名称"></el-input>
					  </el-form-item>
					
					  <el-button type="primary" @click='add'>添加</el-button>
					</el-form>
				</el-card>
				
				
				<el-card class="box-card">
					<el-table
					    :data="tableData"
					    border
					    style="width: 100%">
						
					    <el-table-column
					      prop="name"
					      label="方案名称"
					      width="300">
					    </el-table-column>
						
					    <el-table-column
					      prop="desc"
					      label="描述"
					      width="700">
					    </el-table-column>
						
					    <el-table-column  label="功能">
							
						<template slot-scope="scope">
						        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
						        <el-button @click="$router.push('solution/'+scope.row.id)" type="text" size="small">查看子方案</el-button>
						       <el-button type="danger" @click='deleteType(scope.row.id)' icon="el-icon-delete"  size="small" :disabled="scope.row.count>0"></el-button>
						      </template>
						    </el-table-column>
						<el-button type="primary"></el-button>
						
						  
					    </el-table-column>
						
					  </el-table>
						
					
					
				</el-card>
				
				
				
			</el-col>
		</el-row>
		
	</div>
</template>

<script>
	var vueData = {
		forms:{
			name:''
		},
		tableData:[],
		dialogVisible:false,
		dialogUpdate:false,
		uploadHeader:{},
		uploadData:{
			name:'',
			title:'',
			desc:'',
			img:''
		},
		iconList :[]
	};
	export default {
		data:()=>vueData,
		methods:{
			handleExceed(){
				this.$message.warning("最多只能有一个icon图标");
			},
			async handleRemove(file, fileList ){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				this.uploadData.img = '';
			},
			iconUploadSuccess(response, file, fileList){
				console.log(file);
				const fileId = file.response.id;
				this.uploadData.img = fileId;
				console.log(this.uploadData);
			},
			handleClose(){
				this.dialogVisible =false;
				this.dialogUpdate = false;
			},
			async addType(){
				
				if(this.uploadData.name=='' || this.uploadData.desc=='' || this.img==''){
					 this.$message.error('输入为空!');
					 return;
				}
				
				//如果是添加
				if(!this.dialogUpdate){
					console.log(this.uploadData);
					var data  = await this.$axios.post('/solution/add',this.uploadData);
					
					
					if(data.data.code==0){
						this.$message.success('上传成功!');
						this.dialogVisible = false;
						this.getTableData();
					}else{
						this.$message.error(data.data.msg);
					}
				}else{
					var data = await this.$axios.post("/solution/update",this.uploadData);
					if(data.data.code==0){
						this.$message.success('修改成功!');
						this.dialogVisible = false;
						this.getTableData();
					}else{
						this.$message.error(data.data.msg);
					}
				}
				
				
			},
			async getTableData(){
				const data = await this.$axios.get('/solution/getAll');
				console.log(data.data.data);
				this.tableData = data.data.data;
			},
			add(){
				console.log(this.uploadData);
				this.uploadData ={name:'', desc:'', img:'' }
		
				this.dialogVisible = true;
				this.dialogUpdate = false;
				this.iconList = [];
				console.log(this.uploadData);
			},
			edit(data){
				this.uploadData ={name:'', desc:'', img:'' }
				console.log(data);
				this.uploadData = data;
				this.dialogVisible = true;
				this.dialogUpdate = true;
			},
			deleteType(id){
				this.$confirm('此操作将永久删除该方案, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(async () => {
					var data = await this.$axios.post("/solution/delete/"+id);
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
			}
			
		},
		mounted(){
			this.uploadHeader = {'token':window.localStorage.getItem("token")}
			this.getTableData();
		}
	}
</script>

<style>
</style>
