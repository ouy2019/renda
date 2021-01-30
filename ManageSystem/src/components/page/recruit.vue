<template>
	<div>
		<!-- 招聘信息 -->

		<!-- 弹出层 -->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="80%"  :before-close='handleClose'>
			<el-card class="box-card" style="">
				<el-form ref="forms" :model="forms" label-width="80px" inline>
			
					<el-form-item label="岗位名称">
						<el-input v-model="forms.name"></el-input>
					</el-form-item>
			
					<el-form-item label="工作地点">
						<el-input v-model="forms.workAddr" ></el-input>
					</el-form-item>
			
					<el-form-item label="薪资待遇" >
						<el-input v-model="forms.salary" placeholder='面议 或 xxx-xxx元' ></el-input>
					</el-form-item>
					
					<br/>
					
					<el-form-item label="工作经验" >
						<el-input v-model="forms.experience" placeholder="1-3年"></el-input>
					</el-form-item>
					
					<el-form-item label="学历要求">
						<el-input v-model="forms.education" ></el-input>
					</el-form-item>
					
					<el-form-item label="岗位类型" >
						<el-input v-model="forms.type" placeholder="全职"></el-input>
					</el-form-item>
					
					<br/>
					
					<el-form-item label="招聘人数">
						<el-input v-model="forms.num" placeholder="30" type="number"></el-input>
					</el-form-item>
					
					<br/>
					<el-form-item label="岗位职责">
						<el-input type="textarea"  v-model="forms.responsibility" style="width: 350px;" :rows="6" placeholder="请输入内容" >
						</el-input>
					</el-form-item>
					
					<el-form-item label="任职资格">
						<el-input type="textarea" v-model="forms.required" style="width: 350px;" :rows="6" placeholder="请输入内容" >
						</el-input>
					</el-form-item>
			
				</el-form>
			</el-card>
			
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 弹出层结束 -->
		
		
		<el-card class="box-card" shadow="hover" style="height: 60px;">
			<el-form :inline="true" class="demo-form-inline">

				<el-form-item label="岗位名">
					<el-input v-model="name2" placeholder="岗位名" style="width: 160px;"></el-input>
				</el-form-item>

				<el-form-item style="margin-left: 100px;">
					<!-- <el-button round type="primary" icon="el-icon-circle-plus" @click='$router.push("/recruitAdd")'>新增</el-button> -->
					<el-button round type="primary" icon="el-icon-circle-plus" @click='dialogVisible=true'>新增</el-button> 
					<el-button type="warning" round icon="el-icon-error" @click="updateStatus(1)">禁用</el-button>
					<el-button type="success" round icon="el-icon-success" @click="updateStatus(0)"> 启用</el-button>
					<el-button type="danger" round icon="el-icon-delete" @click="deleteLogic(selectList)">删除</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="box-card" shadow="hover">

			<el-table :data="recruitData" height="400" border style="width: 100%;height: 400px; font-size: 12px;"
			 :row-class-name="tableowColor" @selection-change="selectChange($event)">
				<el-table-column fixed type="selection" width="100"></el-table-column>
				<el-table-column prop="name" label="名称" width="150"></el-table-column>
				<el-table-column prop="workAddr" label="工作地点" width="150"></el-table-column>
				<el-table-column prop="salary" label="薪资待遇" width="150"></el-table-column>
				<el-table-column prop="education" label="学历要求" width="100"></el-table-column>
				<el-table-column prop="experience" label="工作经验" width="100"></el-table-column>
				<el-table-column prop="num" label="招聘人数" width="100"></el-table-column>
				<el-table-column prop="sort" label="排序" width="100" sortable></el-table-column>

				<el-table-column fixed="right" label="操作" width="300">
					<template slot-scope="scope" style="text-align: center;margin-left: 0px;">
						<el-button type="text" size="small" @click="updateSort(scope.row)">排序</el-button>
						<el-button type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
						<el-tooltip :content="scope.row.status==0?'点击禁用':'点击启用'" placement="top">
							<el-switch label="状态" :value="scope.row.status==0" @change="switchChange($event,scope.row)">
							</el-switch>
						</el-tooltip>
						<el-button type="danger" icon="el-icon-delete" circle style="margin-left: 30px;" @click='deleteLogic([scope.row.id])'></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 底部分页 -->
		<div class="block" style="text-align: right;margin-top: 20px;">
			<el-pagination :current-page="pageNum" :page-size="pageSize" :page-sizes="[7, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper"
			 @size-change="sizeChange($event)" @current-change='currentChange($event)' :total="total">

			</el-pagination>
		</div>
	</div>
</template>

<script>
	var datas = {
		forms: {
			name: '',
			workAddr:'',
			experience:'',
			education:'',
			type:'',
			responsibility:'',
			required:'',
			num:''
		},
		name2:'',
		isUpdate:false, //弹出层是否修改
		pageSize: 7,
		pageNum: 1,
		total: 0,
		recruitData: [],
		selectList: [],
		dialogVisible:false
	};
	export default {
		name: 'rotation',
		data: () => datas,
		components: {},
		methods: {
			async getData() {
				const {
					data: result
				} = await this.$axios.get('/about/getPosition', {
					params: {
						name: this.name2,
						pageSize: this.pageSize,
						pageNum: this.pageNum
					}
				});

				this.total = result.data.total;
				this.recruitData = result.data.list;
			},
			tableowColor({
				row,
				rowIndex
			}) {
				if (row.status != 0) {
					return 'warning-row';
				}
			},
			sizeChange(pageSize) {
				this.pageSize = pageSize;
			},
			currentChange(pageNum) {
				this.pageNum = pageNum;
			},
			/* 修改状态 */
			async switchChange(val, row) {
				var status = val ? 0 : 1;
				row.status = status;
				const {
					data: result
				} = await this.$axios.post("/about/updateStatus/" + row.id + "?status=" + status);
				result.code == 0 ? this.$message.success("禁用成功") : this.$message.success("禁用失败");
			},
			selectChange(list) {
				this.selectList = list.map(o => o.id);
			},
			async updateStatus(status) {
				var params = {
					"idList": this.selectList,
					'status': status
				};
				const {
					data: result
				} = await this.$axios.post("/about/updateStatus", params);
				result.code == 0 ? this.$message.success(status == 0 ? "启用成功!" : "禁用成功!") : this.$message.success(status == 0 ?
					"启用失败!" : "禁用失败!");
				if (result.code == 0) {
					this.getData();
				}
			},
			deleteLogic(idList) {
				var _this = this;
				this.$confirm('此操作将永久删除该招聘信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.deleteRecruit(idList);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			async deleteRecruit(idList) {
				if (idList == undefined || idList.length < 1) {
					this.$message.warning('请选择后删除');
					return;
				}

				const {
					data: result
				} = await this.$axios.post("/about/delete", idList);
				if (result.code == 0) {
					this.getData();
					this.$message.success("删除成功");
				} else {
					this.$message.success("删除失败");
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
					const {
						data: result
					} = await _this.$axios.post('/about/updateSort/' + row.id + "?sort=" + value);
					if (result.code == 0) {
						_this.$message.success("排序修改成功!");
						_this.getData(); //重新查询
					} else {
						_this.$message.error("排序修改失败!");
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});

			},
			//用户弹出层提交数据
			async submitForm(){
				this.forms.responsibilityList =   this.forms.responsibility.split("\n");
				this.forms.requiredList =   this.forms.required.split("\n");
				
				console.log('======== ADD ========');
				console.log(this.forms.requiredList);
				console.log(this.forms.responsibilityList);
				
				if(this.isUpdate){
					var {data:result} = await this.$axios.post("/about/update",this.forms);
				}else{
					var {data:result} = await this.$axios.post("/about/add",this.forms);
				}
				
				
				if(result.code==0){
					this.$message.success(this.isUpdate?"修改成功,当前处于禁用状态":"新增成功,请前往激活!");
					this.forms = {
						name: '',
						workAddr:'',
						experience:'',
						education:'',
						type:'',
						responsibility:'',
						required:'',
						num:'',
					};
					this.dialogVisible = false;
					this.isUpdate = false;
				}else{
					this.$message.error(this.isUpdate?"修改失败":"新增失败")
				}
				
			},
			async edit(id){
				this.isUpdate = true;
				this.dialogVisible = true;
				const {data:result} =await this.$axios.get("/about/get/"+id);
				this.forms = result.data;
				
			},
			handleClose(){
				this.isUpdate = false;
				this.dialogVisible=false;
				this.forms = {
					name: '',
					workAddr:'',
					experience:'',
					education:'',
					type:'',
					responsibility:'',
					required:'',
					num:'',
				};
			}
		},
		created() {
			this.getData()
		},

		watch: {
			'name2': function(newData) {
				this.pageNum = 1;
				this.getData();
			},
			'pageNum': function() {
				this.pageNum = 1;
				this.getData();
			},
			'pageSize': function() {
				this.pageNum = 1;
				this.getData();
			}
		}
	}
</script>

<style>
	.el-table .warning-row {
		/* background: rgb(175, 199, 255); */
	}
</style>
