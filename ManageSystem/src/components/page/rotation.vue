<template>
	<div>

		<el-card class="box-card" shadow="hover" style="height: 60px;">
			<el-form :inline="true" class="demo-form-inline">

				<el-form-item label="文章名">
					<el-input v-model="forms.name" placeholder="文章名" style="width: 160px;"></el-input>
				</el-form-item>
				
				<el-form-item label="轮播图类型" >
					<el-select v-model="forms.type" placeholder="请选择" style="width: 120px;">
					<el-option :value="-1" :label="'所有'">所有</el-option>
					<el-option :value="1" :label="'首页轮播图'">首页轮播图</el-option>
					<el-option :value="2" :label="'成功案例轮头图'">成功案例轮头图</el-option>
					<el-option :value="3" :label="'媒体报道头图'">媒体报道头图</el-option>
					<el-option :value="4" :label="'服务支持头图'">服务支持头图</el-option>
					<el-option :value="5" :label="'关于我们头图'">关于我们头图</el-option>
				  </el-select>
				</el-form-item>

				<el-form-item style="margin-left: 100px;" >
					<el-button round type="primary" icon="el-icon-circle-plus" @click='$router.push("/rotationAdd")' >新增</el-button>
					<el-button type="warning" round icon="el-icon-error" @click='updateStatus(1)'>禁用</el-button>
					<el-button type="success" round icon="el-icon-success" @click="updateStatus(0)"> 启用</el-button>
					<el-button type="danger" round icon="el-icon-delete"  @click='deleteBanner(selectRows)'>删除</el-button>
				</el-form-item>

			</el-form>
		</el-card>

		<el-card class="box-card" shadow="hover">

			<el-table :data="tableData" height="450" border style="width: 100%;height: 450px; font-size: 12px;"  :row-class-name="tableowColor"
			 @selection-change="selectChange($event)">
				<el-table-column fixed type="selection" width="100"></el-table-column>
				<el-table-column prop="name" label="名称" width="150"></el-table-column>
				<el-table-column prop="imgUrl" label="访问地址" width="300"></el-table-column>
				<el-table-column prop="filepath" label="文件地址" width="300"></el-table-column>
				<el-table-column prop="typeName" label="类型" width="100" ></el-table-column>
				<el-table-column prop="sort" label="排序" width="100" sortable></el-table-column>
				<el-table-column fixed="right" label="操作" width="300">
					<template slot-scope="scope" style="text-align: center;margin-left: 0px;">
						<el-button  type="text" size="small" @click="updateSort(scope.row)">排序</el-button>
						<el-button type="text" size="small" @click="$router.push({path:'/rotationAdd',query:{update:true,id:scope.row.id}})">编辑</el-button>
						<el-tooltip :content="scope.row.status==0?'点击禁用':'点击启用'" placement="top">
							<el-switch  label="状态"  :value ="scope.row.status==0"  @change="switchChange($event,scope.row)" >
							</el-switch>
						</el-tooltip>
						<el-button type="danger" icon="el-icon-delete" circle style="margin-left: 30px;" @click='deleteBanner([scope.row.id])'></el-button>
					</template>
				</el-table-column>

			</el-table>
		</el-card>
		<!-- 底部分页 -->
		<div class="block" style="text-align: right;margin-top: 20px;">
			<el-pagination :current-page="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper"
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
				tableData: [],
				pageNum: 1,
				pageSize: 5,
				total: 500,
				forms: {
					name: '',
					type:''
				},
				selectRows:[]
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
				} = await this.$axios.get("/banner/get", {
					params: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						name:this.forms.name,
						type:this.forms.type
					}
				});
				console.log(result);
				if (result.code == 0) {
					this.total = result.data.total;
					this.tableData = result.data.list;
				}
			},
			async switchChange($event,row){
				const status = row.status==1?0:1;
				//调用接口 禁用或启用 submit
				const {data:result} = await this.$axios.post("/banner/updateStatus?id="+row.id+"&status="+status);
				console.log(result);
				if(result.code==0){
					this.$message.success($event?'启用成功!':"禁用成功!");
					row.status = $event?0:1;
				}else{
					this.$message.success($event?'启用失败!':"禁用失败!");
				}
			},
			async updateStatus(status){
				
				//调用接口 禁用或启用 submit
				const {data:result} = await this.$axios.post("/banner/updateStatusList",{ids:this.selectRows,status:status});
				console.log(result);
				if(result.code==0){
					this.$message.success(status==0?'启用成功!':"禁用成功!");
					this.getTableData();
				}else{
					this.$message.warning(result.msg);
				}
			},
			async deleteBanner(ids){
				var _this = this;
				
				this.$confirm('确定要删除该轮播图?', '提示', {
							  confirmButtonText: '确定',
							  cancelButtonText: '取消',
							  type: 'warning'
							}).then(async () => {
							  if(ids ==undefined || ids.length<1){
								_this.$message.warning('请选择轮播图后删除');
								return;
							  }
							  const {data:result} = await _this.$axios.post('/banner/delete',ids);
							  
							  if(result.code ==0){
								_this.$message.success("删除成功!");
								_this.getTableData();
							  }else{
								_this.$message.error(result.msg);
							  }
							}).catch(() => {
							  _this.$message({
								type: 'info',
								message: '已取消删除'
							  });          
							});
						
				
			
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
						const {data:result} = await _this.$axios.post('/banner/updateSort?id='+row.id+"&sort="+value);
						if(result.code==0){
							_this.$message.success("排序修改成功!");
							_this.getTableData();//重新查询
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
			this.getTableData();
		},
		watch:{
			pageSize:function(){
				this.getTableData();
			},
			pageNum:function(){
				this.getTableData();
			},
			'forms.type': function(){
				this.pageNum=1;
				this.getTableData();
			},
			'forms.name': function(){
				this.pageNum=1;
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
