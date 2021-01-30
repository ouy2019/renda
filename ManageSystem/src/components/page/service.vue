<template>
	<div>
		
		
		<!-- 弹出层 -->
		
		<el-dialog title="编辑" :visible.sync="dialogTableVisible" width="70%" height='20%' :close-on-click-modal="false"  :modal='true'>
			<div>
				<span style="margin-right: 10px;">问题:</span>
				<el-input v-model="questionObj.question" placeholder="请输入问题" style="width: 300px;"></el-input>
				
				
				<span style="margin-right: 10px;margin-left: 60px;">产品类型:</span>
				<el-select v-model="questionObj.typeId" placeholder="请选择">
					<el-option v-for="item in questionType" :label="item.name" :value="item.id"></el-option>
				</el-select>
				
				<span style="margin-right: 10px;margin-left: 60px;">问题类型:</span>
				<el-select v-model="questionObj.type" placeholder="请选择">
					<el-option label="产品常见问题" :value="1"></el-option>
					<el-option label="应用常见问题" :value="2"></el-option>
				</el-select>
				
				<br/>
				<br/>
				
				<!-- markdown 富文本编辑器 -->
				<mavon-editor v-model="markDownContent" ref="md" @imgAdd="$imgAdd" @change="change" style=" width: 100%; min-height: 200px;" />
						
			</div>
			 
				
			
			<div slot="footer" class="dialog-footer">
			      <el-button @click="dialogTableVisible = false">取消</el-button>
			      <el-button type="primary" @click='submitQuestion'>确定</el-button>
		    </div>
					
			
			
		</el-dialog>
		
		<!-- 弹出层结束 -->
		
		

		<el-card class="box-card" shadow="hover" style="height: 60px;">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="文章名">
					<el-input v-model="forms.name" placeholder="文章名" style="width: 160px;"></el-input>
				</el-form-item>

				<el-form-item label="产品分类">
					<el-select v-model="forms.typeId" placeholder="请选择分类" style="width: 120px;">
						<el-option label="所有" :value="0"></el-option>
						<el-option v-for="item in questionType" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="问题分类">
					<el-select v-model="forms.type" placeholder="请选择分类" style="width: 120px;">
						<el-option label="所有" :value="0"></el-option>
						<el-option label="产品常见问题" :value="1"></el-option> 
						<el-option label="应用常见问题" :value="2"></el-option>
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
				
				<el-table-column prop="question" label="问题" width="500">
				</el-table-column>

				<el-table-column prop="typeName" label="所属分类" width="160">
				</el-table-column>

				<el-table-column prop="createTime" label="上传时间" width="150">
				</el-table-column>
				
				<el-table-column prop="sort" label="排序" width="100" sortable>
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
			<el-pagination :current-page='forms.pageNum' :page-sizes="[7, 10, 15, 20]" :page-size="forms.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" @size-change="onPageSizeChange" @current-change="onPageNumChange">

			</el-pagination>
		</div>

	</div>

</template>

<script>
	import {mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	
	
	var datas = {
		forms: {
			name: '',
			typeId: '',
			type:'', //问题分类 1产品常见问题，2应用常见问题
			pageNum: 1,
			pageSize: 7
		},
		questionObj:{
			id:'',
			question : '',
			answer :'',
			type : '', // 1 产品 2 应用  常见问题 分类
			typeId: ''  ,//分类id
			answerContent : ''
		},
		dialogTableVisible:false, //弹出层展示
		questionType: [], //问题类型list
		tableData: [],
		total: 0,
		selectIds:[], //表格内被选中的id
		markDownContent:'', //富文本 content
		markDownHtml:'' //富文本 html
		
	}


	export default {
		data: () => datas,
		methods: { 
			$imgAdd(pos, $file) { //markDown 图片上传
				var formdata = new FormData();
				formdata.append('file', $file);
				// 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
				this.$axios({
					url: '/file/uploadImg',
					method: 'post',
					data: formdata,
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				}).then((data) => {
					console.log( data.data);//markdown 上传图片后的回调 将图片的访问地址替换
					this.$refs.md.$img2Url(pos, data.data.accessPath);
				})
			},
			change(value, render) { //markDown 当值发生改变时触发
				// render 为 markdown 解析后的结果
				this.markDownHtml = render;
			},
			async getData() {
				const {
					data: result
				} = await this.$axios.get('/question/get', {
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
				const {data:result} = await this.$axios.post("/question/updateStatus",param);
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
			          
					  const {data:result} = await _this.$axios.post("/question/delete",idList);
					  if(result.code == 0){
					  	_this.$message.success("删除成功");
						this.getData();
					  }
					  
		   })
		},
		
		//展示弹出层
		showDialogTable(){
			this.questionObj = {
				id:'',
				question : '',
				answer :'',
				type : '', // 1 产品 2 应用  常见问题 分类
				typeId: ''  ,//分类id
				answerContent : ''
			};
			this.dialogTableVisible = true;
		},
		async submitQuestion(){
			console.log(this.questionObj);
			
			this.questionObj.answer = this.markDownHtml;
			this.questionObj.answerContent = this.markDownContent;
			
			
			const {data:result} = await this.$axios.post("/question/addOrUpdate",this.questionObj);
			console.log(result);
			if(result.code == 0){
				this.$message.success(this.questionObj.id ==''?"添加成功!":"修改成功!");
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
			const {data:result} = await this.$axios.get("question/get/"+id);
			console.log(result);
			if(result.code == 0){
				this.questionObj = result.data;
				this.markDownContent = result.data.answerContent;
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
		components:{
			mavonEditor
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
			},
			'forms.type':function(newVal){
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
