<template>
	<div>
		<el-dialog title="编辑" :visible.sync="dialogTableVisible" width="70%" :close-on-click-modal="false"  :modal='true'>
			<div>
				<span style="margin-right: 10px;">首页显示时名称:</span>
				<el-input v-model="forms.name" placeholder="请输入名称" style="width: 150px;"></el-input>
				
				<span style="margin-left: 100px;margin-right: 10px;">描述:</span>
				<el-input v-model="forms.desc" placeholder="请输入描述信息" style="width: 300px;" type="textarea"></el-input>
				
				
				<br/><br/>
				
			</div>
			 
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
					  <el-button  type="primary">点击上传小icon图标</el-button>
					  </el-upload>
				</div>
				
				
				 
					<div style="width: 40%; margin-top: 20px;" >
						<el-upload
						  :headers="uploadHeader"
						  :on-remove="handleRemove2"
						  multiple
						  class="upload-demo"
						  :limit="1"
						   accept=".jpg,.png,.jpeg,.JPG,.JPEG"
						   :action="$axios.defaults.baseURL+'/file/uploadImg'"
						  :on-exceed="handleExceed"
						  :file-list="iconList2"
						  list-type="picture"
						  :on-success="iconUploadSuccess2">
						  <el-button  type="primary">点击上传大icon图标</el-button>
						  </el-upload>
					</div>
					
					
					
				
			<div slot="footer" class="dialog-footer">
			      <el-button @click="dialogTableVisible = false">取消</el-button>
			      <el-button type="primary" @click='submitFeature()'>确定</el-button>
		    </div>
			
		</el-dialog>
		
		
		
		<el-card class="box-card" shadow="hover" style="height: 60px; text-align: left;">
			<el-form :inline="true" class="demo-form-inline">

				<el-form-item>
					<el-input v-model="featureName" placeholder="输入查找的名称"></el-input>
				</el-form-item>
				<el-form-item style="margin-left: 100px;" >
					<el-button round type="primary" icon="el-icon-circle-plus" @click='addFeature()' >新增</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="box-card" shadow="hover">

			<el-table :data="tableData" border style="width: 100%;height: 450px; font-size: 12px;"  :row-class-name="tableowColor">
				
				<el-table-column prop="name" label="特点名称" width="200"></el-table-column>
				<el-table-column prop="desc" label="描述" width="900"></el-table-column>
				
				<el-table-column fixed="right" label="操作" width="150">
					<template slot-scope="scope" style="text-align: center;margin-left: 0px;">
						<el-tooltip :content="'编辑'" placement="top">
							<el-button type="success" icon="el-icon-edit" circle style="margin-left: 30px;" @click='updateFeatrue([scope.row.id])'></el-button>
						</el-tooltip>
					</template>
				</el-table-column>

			</el-table>
		</el-card>
		
		<!-- 底部分页 -->
		<div class="block" style="text-align: right;margin-top: 20px;">
			<el-pagination :current-page="pageNum" :page-size="pageSize" :page-sizes="[8, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" @size-change="sizeChange" @current-change="pageNumChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'rotation',
		data() {
			return {
				forms:{
					id :'',
					name:'',
					desc:'',
					icon:'',
					icon2:''
				},
				tableData: [],
				pageNum: 1,
				pageSize: 8,
				total: 500,
				selectRows:[],
				uploadHeader:{'token':window.localStorage.getItem("token")},
				indexIcon:'',
				iconList:[],
				iconList2:[],
				dialogTableVisible:false,
				featureName:""
			}
		},
		components: {

		},
		methods: {
			//切换表格样式
			tableowColor({row, rowIndex}){
				if(row.status!=0){
					return 'warning-row';
				}
			},
			sizeChange(val) {
				this.pageSize = val;
			},
			pageNumChange(val) {
				this.pageNum = val;
			},
			selectChange(rows) {
				this.selectRows = rows.map( o =>o.id);
			},
			//获取表格数据
			async getTableData() {
				const {
					data: result
				} = await this.$axios.get("/product/feature/get", {
					params: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						name:this.featureName
					}
				});
				console.log(result);
				if (result.code == 0) {
					this.total = result.data.total;
					this.tableData = result.data.list;
				}
			},
			
			async handleRemove(file, fileList ){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				this.forms.icon = '';
			},
			async handleRemove2(file, fileList ){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				this.forms.icon2 = '';
			},
			//icon上传成功回调
			iconUploadSuccess(response, file, fileList){
				const fileId = file.response.id;
				this.forms.icon = fileId;
			},
			//icon上传成功回调
			iconUploadSuccess2(response, file, fileList){
				const fileId = file.response.id;
				this.forms.icon2 = fileId;
			},
			handleExceed(){
				this.$message.warning("最多只能有一个icon图标");
			},
			addFeature(){
				this.iconList = [];
				this.iconList2 = [];
				this.forms = {
					id :'',
					name:'',
					desc:'',
					icon:''
				};
				this.dialogTableVisible =true;
			},
			async submitFeature(){
				if(this.forms.name == ''){
					this.$message.error("名称不能为空");
					return;
				}
				if(this.forms.desc == ''){
					this.$message.error("描述不能为空");
					return;
				}
				if(this.forms.icon == ''){
					this.$message.error("请上传图标");
					return;
				}
				console.log(this.forms);
				const {data:result} = await this.$axios.post("/product/feature/addOrUpdate",this.forms);
				if(result.code == 0){
					this.$message.success(this.forms.id == ''?'添加成功':'修改成功');
					this.dialogTableVisible = false;
					this.getTableData();
				}
			},
			async updateFeatrue(id){
				this.iconList = [];
				this.iconList2 = [];
				const {data:result} = await this.$axios.get("/product/feature/get/"+id);
				
				console.log(result.data); 
				this.forms = result.data;
				this.iconList.push({
					url: result.data.iconPath
				});
				
				this.iconList2.push({
					url: result.data.iconBigPath
				});
				this.dialogTableVisible = true;
			},
			async deleteFeatrue(){
				
			}
			
		},
		mounted() {
			this.getTableData();
		},
		watch:{
			pageSize:function(){
				this.getTableData();
			},
			pageNum:function(){
				this.getTableData();
			},
			featureName:function(){
				this.getTableData();
			}
		}
	}
</script>

<style>
	.el-table .warning-row {
		/* background: rgb(235, 216, 208); */
	  }

</style>
