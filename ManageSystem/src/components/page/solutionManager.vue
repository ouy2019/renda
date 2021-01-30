<template>
	<!-- 解决方案 -->
	<div>
		
		
		<el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			
			<el-form :inline="true" :model="solution" class="demo-form-inline">
				<el-form-item label="解决方案名:"><el-input v-model="solution.name"></el-input></el-form-item>
			
				<el-form-item label="方案内容:"><el-input v-model="solution.value"></el-input></el-form-item>
				
				
			</el-form>
			
			<div style="width: 40%; margin-top: 20px;" >
				<el-upload
				  :headers="uploadHeader"
				  :on-remove="handleRemove"
				  multiple
				  class="upload-demo"
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
			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="handleClose">取 消</el-button>
			    <el-button type="primary" @click="updateS()">确 定</el-button>
			  </span>
			
		</el-dialog>
		
		
		
		
		
		
		<el-card class="box-card">
			<el-form :inline="true" :model="formData" class="demo-form-inline">
				<el-form-item label="解决方案名:"><el-input v-model="formData.user"></el-input></el-form-item>

				<el-form-item style="margin-left: 100px;"><el-button type="primary" @click="add()">新增</el-button></el-form-item>
			</el-form>
		</el-card>
		
		<br />
		
		<el-card>
			
			<el-table :data="solutionData" border style="width: 100%">
				
				<el-table-column fixed prop="name" label="方案名称" width="150"></el-table-column>
				
				<el-table-column prop="value" label="方案内容" width="700"></el-table-column>
				<el-table-column prop="sort" label="排序" width="100"></el-table-column>
				
				
				<el-table-column fixed="right" label="操作" >
					<template slot-scope="scope">
						
						<el-button type="primary" @click='editor(scope.row.id)' size="small">编辑</el-button>
						
						<el-button type="danger" @click='deleteS(scope.row.id)' size="small">删除</el-button>
						
						<el-button type="info" @click='sortS(scope.row.id)' size="small">排序</el-button>
					</template>
				</el-table-column>
				
			</el-table>
			
		</el-card>
		
	
	</div>
</template>

<script>
var vueData = {
	formData: {},
	solutionData:[],
	id:0,
	dialogVisible:false,
	solution:{},
	uploadHeader:{'token':window.localStorage.getItem("token")},
	iconList:[]
};

export default {
	data: () =>{return vueData},
	methods:{
		async queryData(id){
			const datas =  await this.$axios.get("/solution/getData/"+id);
			this.solutionData =  datas.data.data;
		},
		async editor(id){
			const reuslt = await this.$axios.get("/solution/query/"+id);
			
			this.solution  = reuslt.data.data;
			this.iconList.push({url:this.solution.imgUrl});
			this.dialogVisible = true;
			
			
		},
		//新增按钮
		add(){
			this.dialogVisible = true;
		},
		//弹出层关闭前回调
		handleClose(){
			this.dialogVisible =false;
			this.solution = {};
			this.queryData(this.id);
			this.iconList =[];
		},
		//图片上传 删除时回调
		async handleRemove(file, fileList ){
			const id = file.response.id; //获取 id
			const {data:result} = await this.$axios.post("/file/delete",[id]);
			this.solution.img = '';
		},
		//图片上传成功回调
		async iconUploadSuccess(response, file, fileList){
			const fileId = file.response.id;
			this.solution.img = fileId;
		},
		//图片超出限制回调
		handleExceed(){
			this.$message.warning("最多只能有一个icon图标");
		},
		//修改
		async updateS(){
			
			var result  = 500;
			if(!this.solution.id){
				result = await this.$axios.get("/solution/add/"+this.id,{params:this.solution});
			}else{
				result = await this.$axios.get("/solution/updateS/",{params:this.solution});
			}
			
			if(result.data.code==0){
				this.$message.success(this.solution.id ? "修改成功" :"修改成功");
				this.dialogVisible = false;
				this.handleClose();
			}else{
				this.$message.success(this.solution.id ? "添加成功" :"添加成功");
				this.dialogVisible = false;
				this.handleClose();
			}
			
		},
		async deleteS(id){
			var _this = this;
			this.$confirm('确定删除此产品?', '标题名称', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  callback: async action => {
				const {data:result} = await this.$axios.post("/solution/deleteS/"+id);
				if(result.code == 0){
					_this.$message.success("删除成功");
					_this.queryData(this.id);
				}else{
					_this.$message.error("删除失败");
				}
			  }
			});
		},
		sortS(id){
			
			var _this = this;
			this.$prompt('修改排序', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  inputPattern: /^(\-|\+)?\d*$/,
				inputErrorMessage: '必须输入数字'
			  }).then(async({ value }) => {
				const {data:result} = await _this.$axios.post('/solution/updateSort?id='+id+"&sort="+value);
				if(result.code==0){
					_this.$message.success("排序修改成功!");
					_this.queryData(this.id);//重新查询
				}
			}).catch(() => {
			  this.$message({
				type: 'info',
				message: '取消输入'
			  });       
			});
			
		}
		
	},
	mounted() {
		this.id = this.$route.params.id;
		this.queryData(this.id);
	}
	
};


</script>

<style></style>
