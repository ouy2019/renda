<template>
	<div>
		<!-- 弹出层 -->

		<el-dialog title="编辑" :visible.sync="dialogTableVisible" width="70%" :close-on-click-modal="false"  :modal='true'>
			<div>
				<span style="margin-right: 10px;">首页显示时名称:</span>
				<el-input v-model="forms.indexName" placeholder="请输入名称" style="width: 150px;"></el-input>
				
				<span style="margin-left: 100px;margin-right: 10px;">描述:</span>
				<el-input v-model="forms.indexDesc" placeholder="请输入描述信息" style="width: 150px;"></el-input>
				
				<!-- <span style="margin-left: 100px;margin-right: 10px;">排序:</span>
				<el-input v-model="forms.indexSort" placeholder="请输入排序" style="width: 150px;"></el-input>
				 -->
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
					  <el-button  type="primary">点击上传icon图标</el-button>
					  </el-upload>
				</div>
				

			<div> 
				<div style="width: 40%; margin-top: 20px;" >
					<el-upload
					  :on-remove="bannerRemove"
					  multiple
					  :headers="uploadHeader"
					  class="upload-demo"
					  :limit="5"
					   accept=".jpg,.png,.jpeg,.JPG,.JPEG"
					   :action="$axios.defaults.baseURL+'/file/uploadImg'"
					  :on-exceed="handleExceed"
					  :file-list="bannerList"
					  list-type="picture"
					  :on-success="bannerUploadSuccess">
					  <el-button  type="primary">点击上传产品图</el-button>
					  </el-upload>
				</div>
			</div>

			<div slot="footer" class="dialog-footer">
			      <el-button @click="dialogTableVisible = false">取消</el-button>
			      <el-button type="primary" @click='submitIndexProduct'>确定</el-button>
		    </div>
					
			
			
		</el-dialog>

		<!-- 弹出层结束 -->



		<!-- 顶部form表单 -->
		<el-card class="box-card" shadow="hover" style="height: 60px;">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="产品名">
					<el-input v-model="title" placeholder="产品名" style="width: 160px;"></el-input>
				</el-form-item>


				<!-- <el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item> -->

				<el-form-item style="margin-left: 0px;">
					<!-- <el-button round type="primary" icon="el-icon-circle-plus" @click="add()">新增</el-button> 
					<el-button type="warning" round icon="el-icon-error" @click='disable(false)'>禁用</el-button>
					<el-button type="success" round icon="el-icon-success" @click='disable(true)'>启用</el-button> -->
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

				<el-table-column prop="name" label="产品名称" width="210">
				</el-table-column>

				<el-table-column prop="indexName" label="显示时名称" width="200">
				</el-table-column>

				<el-table-column prop="indexDesc" label="显示时描述" width="200">
				</el-table-column>

				<el-table-column prop="articleTypeName" label="icon图标" width="160">
					<template slot-scope="scope">
						<el-image style="width: 40px; height: 40px" :src="scope.row.iconUrl"></el-image>
					</template>
				</el-table-column>

				<el-table-column prop="indexSort" label="排序" width="100" sortable>
				</el-table-column>

				<el-table-column fixed="right" label="操作">
					<template slot-scope="scope" style="text-align: center;margin-left: 50px;">
						<el-button @click="updateSort(scope.row)" type="text" size="small">排序</el-button>
						<el-button type="text" size="small" @click="updateIndexInfo(scope.row)">编辑</el-button>
						<el-tooltip :content="scope.row.status==0?'点击禁用':'点击启用'" placement="top">
							<el-switch label="状态" :value="scope.row.status==0" @change="switchChange($event,scope.row)">
							</el-switch>
						</el-tooltip>
						<!-- 删除按钮 -->

					</template>
				</el-table-column>
			</el-table>
		</el-card>


		<!-- 底部分页 -->
		<div class="block" style="text-align: right;margin-top: 20px;">
			<el-pagination :current-page='pageNum' :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" @size-change="onPageSizeChange" @current-change="onPageNumChange">
				<!-- :size-change="getArticle()"
			  "
			  :prev-click='getArticle()'
			  :next-click="getArticle()" -->
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	var datas = {
		forms:{
			indexName:'', // 产品名称
			indexSort:'', //排序
			productId:'', //产品id
			indexIcon:'', //icon图标id
			bannerIdList:[] //轮播图idLists
		},
		uploadHeader:{'token':window.localStorage.getItem("token")},
		pageSize: 5,
		pageNum: 1,
		total: 0,
		territoryId: null, //领域id  发送给后端
		productId: null, //产品id  发送给后端
		articleTypeId: null, //文章分类id  发送给后端
		selectIds: [], //选中的id
		title: '',
		tableData: [], //查询出来的文章数据  从后端获取
		territory: null, //领域信息 从后端获取
		product: null, // 产品信息 从后端获取
		dialogTableVisible:false,
		innerVisible:false,
		iconList:[],
		bannerList:[]
	}
	export default {
		data: () => datas,
		methods: {
			onSubmit() { //获取表格数据
				this.getArticle();
			},
			handleClick(data) {},
			//切换表格样式
			tableowColor({
				row,
				rowIndex
			}) {
				if (row.status != 0) {
					//return 'warning-row';
					return 'warning-row';
				}
			},
			//获取文章类型

			//获取文章数据
			async getArticle(flag) {

				if (!flag) {
					this.pageNum = 1;
				}

				var submitData = {
					'title': this.title,
					'territoryId': this.territoryId,
					'productId': this.productId,
					'pageNum': this.pageNum,
					'pageSize': this.pageSize
				};

				const {
					data: result
				} = await window.axios.get("/product/index/get", {
					params: submitData
				});
				if (result.code != 0) {
					this.$message({
						showClose: true,
						message: '查询文章失败',
						type: 'warning'
					});
					return;
				}

				console.log(result.data);

				this.tableData = result.data.list;
				this.total = result.data.total;
			},
			//当PageNum发生改变
			onPageNumChange(val) {
				this.pageNum = val;
			},
			//当PageSize发生改变
			onPageSizeChange(val) {
				this.pageSize = val;
			},
			//当开个改变时触发
			async switchChange(val, row) {
				var id = row.id; //id 
				const comitData = {
					'id': id,
					'status': val ? 0 : 1
				};
				const {
					data: result
				} = await window.axios.post("/product/index/changeStatus", comitData);
				if (result.code == 0) {
					this.$message.success(val ? '启用成功!' : '禁用成功!');
					row.status = val ? 0 : 1; //status 
				}
			},
			//表格数据事件 当选中表格内的单选框时 将id保存
			selectChange(data) {
				if (data.length > 0) {
					var idList = data.map(data => data.id);
					this.selectIds = idList;
				}
			},
			//禁用所选文章
			disable(flag) {
				if (this.selectIds.length <= 0) {
					this.$message.warning("请先选择后操作");
					return;
				}
				var _this = this;
				this.$confirm('确认' + (flag ? '启用' : '禁用') + '所选的文章?', '标题', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'success',
					callback: action => {
						if (action === 'confirm') {
							if (flag) {
								_this.ableArticle();
							} else {
								_this.disableArticle();
							}

						} else {
							_this.$message.success("您已取消删除");
						}
					}
				})
			},
			
			//禁用所选文章 
			async disableArticle() {
				const {
					data: result
				} = await window.axios.post('/product/index/disable', this.selectIds);
				if (result.code == 0) {
					this.$message.success("数据禁用成功!");
					this.getArticle(); //禁用后重新查询
				} else {
					this.$message.error(result.msg);
				}
			},
			//启用
			async ableArticle() {
				const {
					data: result
				} = await window.axios.post('/product/index/enable', this.selectIds);
				if (result.code == 0) {
					this.$message.success("数据启用成功!");
					this.getArticle(); //禁用后重新查询
				} else {
					this.$message.error(result.msg);
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
					} = await _this.$axios.post('/product/index/updateSort?id=' + row.id + "&sort=" + value);
					if (result.code == 0) {
						_this.$message.success("排序修改成功!");
						_this.getArticle(); //重新查询
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			updateShow(row) {
				console.log(row);
				this.dialogTableVisible = true;
			},
			//文件删除时回调
			async handleRemove(file, fileList ){
				const id = file.response.id; //获取 id
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				console.log(result);
				this.indexIcon = '';
			},
			handleExceed(){
				this.$message.warning("一个产品最多只能存在一个icon图标");
			},
			//icon上传成功回调
			iconUploadSuccess(response, file, fileList){
				const fileId = file.response.id;
				this.forms.indexIcon = fileId;
			},
			 bannerUploadSuccess(response,file,fileList){
				const fileId = file.response.id;
				this.forms.bannerIdList.push(fileId);
			},
			async bannerRemove(response,file, fileList ){
				
				var id =null;
				if(response.response == undefined){ //如果是以前有的
					id = response.id;
				}else{
					 id = file.response.id; //获取新上传的id
				}
				
				const {data:result} = await this.$axios.post("/file/delete",[id]);
				console.log(result);
				//删除bannerIdList 
				console.log(this.forms);
				this.$axios.post('/product/index/deleteBanner?productId='+this.forms.productId+"&fileId="+id);
				const deleteIndex = this.forms.bannerIdList.findIndex(item => {return item.id == id})
				this.forms.bannerIdList.splice(deleteIndex,1);
				console.log(this.forms.bannerIdList);
			},
			//修改后提交产品信息
			async submitIndexProduct(){
				console.log(this.forms);
				const {data:result} = await this.$axios.post("/product/index/update",this.forms);
				if(result.code == 0){
					this.$message.success("修改成功,请确认后激活");
					this.getArticle();
					this.dialogTableVisible = false;
					
				}else{
					this.$message.warning(result.msg);
				}
				
			},
			//点击编辑弹出层 获取对应的产品信息
			async updateIndexInfo(row){
				
				const {data:result} = await this.$axios.get("/product/index/get/"+row.id);
				
				this.forms = result.data;
				this.forms.bannerIdList=[];
				this.iconList = result.data.iconList;
			
				this.bannerList = result.data.bannerList;
				this.dialogTableVisible = true;
			}
			
		},
		created() {
			this.getArticle();
			
		},
		watch: {
			pageSize() {
				this.getArticle(true);
			},
			pageNum() {
				this.getArticle(true);
			},
			title() {
				this.getArticle(false);
			}

		}
	};
</script>

<style>
.el-upload {
	border: 0px;
	width: 100px;
	height: 50px;
}

</style>
