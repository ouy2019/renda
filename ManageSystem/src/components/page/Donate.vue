<template>
	<div>
		<!-- 文章管理 -->
		<!-- 顶部form表单 -->
		<el-card class="box-card" shadow="hover" style="height: 60px;">
			<el-form :inline="true" class="demo-form-inline" >
				<el-form-item label="文章名">
					<el-input v-model="title" placeholder="文章名" style="width: 160px;"></el-input>
				</el-form-item>

				<el-form-item label="领域">
					<el-select v-model="territoryId" placeholder="请选择领域" style="width: 120px;" >
						<el-option label="所有" :value="0"></el-option>
						<el-option v-for="item in territory"  :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="产品">
					<el-select v-model="productId" placeholder="请选择产品" style="width: 120px;">
						<el-option label="所有" :value="0"></el-option>
						<el-option  v-for="item in product"  :label="item.name" :value="item.id" ></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="文章类型">
					<el-select v-model="articleTypeId" placeholder="请选择类型" style="width: 120px;">
						<el-option label="所有" :value="0"></el-option>
						<el-option v-for="item in articleType" :value='item.id' :label="item.name" v-text="item.name"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>

				<el-form-item style="margin-left: 0px;">
					<el-button round type="primary" icon="el-icon-circle-plus" @click="toArticleAddPage">新增</el-button>
					 <el-button type="warning" round icon="el-icon-error" @click='disable(false)'>禁用</el-button>
					<el-button type="success" round icon="el-icon-success" @click='disable(true)'>启用</el-button> 
					<el-button type="danger" round icon="el-icon-delete" @click="remove()">删除</el-button>
				</el-form-item>
			</el-form>
		</el-card>


		<!-- 底部表格-->
		<el-card class="box-card" shadow="hover">
			<el-table :data="tableData"  height="400" border style="width: 100%;height: 400px; font-size: 12px;" :row-class-name="tableowColor"  @selection-change="selectChange($event)">
					<el-table-column type="selection" width="55" >
					</el-table-column>

					<el-table-column fixed prop="id" label="编号" width="60">
					</el-table-column>
					<el-table-column prop="title" label="文章名称" width="200">
					</el-table-column>
					<el-table-column prop="territoryName" label="所属领域" width="160">
					</el-table-column>
					<el-table-column prop="productName" label="所属产品" width="160">
					</el-table-column>
					<el-table-column prop="articleTypeName" label="所属分类" width="160">
					</el-table-column>
					<el-table-column prop="createTime" label="上传时间" width="150">
					</el-table-column>
					<el-table-column prop="sort" label="排序" width="100" sortable>
					</el-table-column>
					<el-table-column fixed="right"  label="操作" width="200"  >
						<template slot-scope="scope"  style="text-align: center;margin-left: 50px;">
							<el-button @click="updateSort(scope.row)" type="text" size="small">排序</el-button>
							<el-button type="text" size="small" @click="updateArticle(scope.row)">编辑</el-button>
							<el-tooltip :content="scope.row.status==0?'点击禁用':'点击启用'" placement="top">
								<el-switch  label="状态"  :value ="scope.row.status==0"  @change="switchChange($event,scope.row)"   >
								</el-switch>
							</el-tooltip>
							<!-- 删除按钮 -->
							<el-button type="danger" icon="el-icon-delete" circle style="margin-left: 30px;" @click='deleteOne([scope.row.id])'></el-button>
						</template>
					</el-table-column>
			</el-table>
		</el-card>
	
		
		<!-- 底部分页 -->
		<div class="block" style="text-align: right;margin-top: 20px;">
			<el-pagination
			  :current-page='pageNum'
			  :page-sizes="[5, 10, 15, 20]"
			  :page-size="pageSize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total"
			  @size-change="onPageSizeChange"
			  @current-change="onPageNumChange"
			  >
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
		pageSize:5, 
		pageNum:1,
		total:0,
		territoryId:null, //领域id  发送给后端
		productId:null, //产品id  发送给后端
		articleTypeId:null, //文章分类id  发送给后端
		selectIds:[], //选中的id
		title:'',
		tableData: [], //查询出来的文章数据  从后端获取
		territory:null, //领域信息 从后端获取
		product:null, // 产品信息 从后端获取
		articleType:null // 文章分类信息 从后端获取
	}
	export default {
		data: () => datas,
		methods: {
			onSubmit() { //获取表格数据
				this.getArticle();
			},
			handleClick(data){
			},
			//切换表格样式
			tableowColor({row, rowIndex}){
				if(row.status!=0){
					//return 'warning-row';
					return 'warning-row';
				}
			},
			// 获取文章领域分类
			async getArticleTerritory(){
				const {data:result} = await window.axios.get("/territory/getTerritory");
				if(result.code==0){
					return this.territory = result.data;
				}
				 this.$message({
				  showClose: true,
				  message: '获取文章领域分类失败',
				  type: 'warning'
				});
			},
			//获取文章类型
			async getArticleType(){
				const {data:result} = await window.axios.get("/territory/getArticleType");
				if(result.code==0){
					return this.articleType = result.data;
				}
				 this.$message({
				  showClose: true,
				  message: '获取文章类型失败',
				  type: 'warning'
				});
				this.articleType = [];
			},
			//获取文章数据
			async getArticle(flag){
				
				if(!flag){
					this.pageNum =1;
				}
				
				var submitData = {
					'title':this.title,
					'articleType':this.articleTypeId,
					'territoryId':this.territoryId,
					'productId':this.productId,
					'pageNum':this.pageNum,
					'pageSize':this.pageSize
				};
				
				const {data:result} = await window.axios.get("/article/get",{params:submitData});
				if(result.code !=0){
					this.$message({
					  showClose: true,
					  message: '查询文章失败',
					  type: 'warning'
					});
					return;
				}
				this.tableData = result.data.list;
				this.total = result.data.total;
			},
			//当PageNum发生改变
			onPageNumChange(val){
				this.pageNum = val;
			},
			//当PageSize发生改变
			onPageSizeChange(val){
				this.pageSize = val;
			},
			//当开个改变时触发
			async switchChange(val,row){
				row.status = val?0:1;  //status 
				var id = row.id; //id 
				const comitData = {'id':id,'status':row.status};
				const {data:result} = await window.axios.post("/article/changeStatus",comitData);
				if(result.code==0){
					this.$message.success(val?'启用成功!':'禁用成功!');
				}
			},
			//表格数据事件 当选中表格内的单选框时 将id保存
			selectChange(data){
				if(data.length>0){
					var idList = data.map(data=> data.id);
					this.selectIds = idList;
				}
			},
			remove(){
				if(this.selectIds.length<=0){
					this.$message.warning("请先选择后操作");
					return;
				}
				var _this = this;
				this.$confirm('文章将彻底删除,请确认您的操作!', '标题', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'success',
					callback: action => {
					  if (action === 'confirm') {
						_this.deleteArticle(_this.selectIds);
					  }
					  else {
						_this.$message.success("您已取消删除");
					  }
					}
				  })
			},
			//禁用所选文章
			disable(flag){
				if(this.selectIds.length<=0){
					this.$message.warning("请先选择后操作");
					return;
				}
				var _this = this;
				this.$confirm('确认'+(flag?'启用':'禁用')+'所选的文章?', '标题', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'success',
					callback: action => {
					  if (action === 'confirm') {
						  if(flag){
							  _this.ableArticle();
						  }else{
							   _this.disableArticle();
						  }
						
					  }
					  else {
						_this.$message.success("您已取消删除");
					  }
					}
				  })
				
				
			},
			async deleteArticle(idList){
				console.log(idList);
				const {data:result} = await window.axios.post('/article/delete',idList);
				if(result.code==0){
					this.$message.success("数据删除成功!");
					this.getArticle();//删除后重新查询
				}else{
					this.$message.error(result.msg);
				}
			
			},
			deleteOne(data){
				var _this = this;
				this.$confirm('文章将彻底删除,请确认您的操作!', '标题', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'success',
					callback: action => {
					  if (action === 'confirm') {
						_this.deleteArticle(data);
					  }
					  else {
						_this.$message.success("您已取消删除");
					  }
					}
				  })
			},
			//禁用所选文章 
			async disableArticle(){
				const {data:result} = await window.axios.post('/article/disable',this.selectIds);
				if(result.code==0){
					this.$message.success("数据禁用成功!");
					this.getArticle();//禁用后重新查询
				}else{
					this.$message.error(result.msg);
				}
			},
			//启用所选文章
			async ableArticle(){
				const {data:result} = await window.axios.post('/article/able',this.selectIds);
				if(result.code==0){
					this.$message.success("数据启用成功!");
					this.getArticle();//禁用后重新查询
				}else{
					this.$message.error(result.msg);
				}
			},
			updateArticle(article){
				
				var idx  = this.$parent.$refs.tags.tagsList.findIndex(o =>{
					return o.title == "文章添加";
				});
				
				console.log("删除==>"+idx);
				if(idx > -1){
					//解决 bug 
					this.$parent.$refs.tags.tagsList.splice(idx,1);
				}
				
				this.$router.push({path:"/ArticleAdd",param:{'update':true},query:{update:true,id:article.id}});
			},
			updateSort(row){
				var _this = this;
				this.$prompt('修改排序', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  inputPattern: /^(\-|\+)?\d*$/,
						inputErrorMessage: '必须输入数字'
					  }).then(async({ value }) => {
						console.log(value);
						const {data:result} = await _this.$axios.post('/article/updateSort?id='+row.id+"&sort="+value);
						if(result.code==0){
							_this.$message.success("排序修改成功!");
							_this.getArticle();//重新查询
						}
					}).catch(() => {
					  this.$message({
						type: 'info',
						message: '取消输入'
					  });       
					});
			},
			toArticleAddPage(){
				/* var idx  = this.$parent.$refs.tags.tagsList.findIndex(o =>{
					return o.title == "文章添加";
				});
				
				console.log("删除==>"+idx);
				if(idx > -1){
					//解决 bug 
					this.$parent.$refs.tags.closeTags(idx);
				}
			 */
			    this.$router.push({path:'/ArticleAdd',query:{'update':false}});
			}
		},
		created(){
			this.getArticleTerritory();
			this.getArticleType();
			this.getArticle();
		},
		watch:{
			async territoryId(territoryId){ //当选择了 领域 获取领域的产品
				const {data:result} = await window.axios.get("/territory/getProducts?territoryId="+territoryId);
				if(result.code == 0){
					return this.product = result.data;
				}
				this.$message({
				  showClose: true,
				  message: '获取文章领域分类失败',
				  type: 'warning'
				});
			},
			pageSize(){
				this.getArticle(true);
			},
			pageNum(){
				this.getArticle(true);
			},
			title(){
				this.getArticle(false);
			}
		
		}
	};
</script>

<style>
	.el-table .warning-row {
		/* background: rgb(235, 216, 208); */
	  }

</style>
