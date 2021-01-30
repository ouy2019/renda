<template>
	<div>
		<el-row>
			<el-col :span="6">

				<el-tree :data="treeData" @node-click="handleNodeClick" accordion>
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span v-text="data.type==1?'领域':'产品分类'" style="margin-left: 50px;font-size: 13px;" :class="data.type==1? 'territoryFont' : 'productFont' ">11</span>
						<span v-if="data.type!=1"  style="margin-left: 50px;font-size: 13px; color: red;" @click.stop='delProduct(data.id)'>删除</span>
					</span>

				</el-tree>

			</el-col>

			<el-col :span="16" style="margin-left: 30px;">
				<el-card class="box-card" style="background: lightgray">

					<div>
						<el-button type="primary" @click='addTerritory'>添加领域</el-button>
						<el-button type="success" v-if="canAdd" @click='addProduct()'>添加产品</el-button>
					</div>

					<div style="margin-top: 30px;">
						<el-table :data="tableData" style="width: 100%;text-align: center;"  size='medium' border  height>
							
							<el-table-column prop="id" label="编号" width="100">
							</el-table-column>

							<el-table-column prop="name" label="产品名" width="320">
							</el-table-column>
							
							<el-table-column  label="访问地址" width="400">
								<template slot-scope="scope">
								    <el-link type="primary" :href='scope.row.accessPath'>点击访问</el-link>
							    </template>
							</el-table-column>
							
						</el-table>

					</div>

				</el-card>



			</el-col>

		</el-row>

	</div>
</template>

<script>
	var data = {
		tableData: [],
		treeData: [],
		canAdd: false, //是否能够添加产品
		checkedId : '',
		frontUrl:'' //前台地址
	};
	export default {
		name: 'field',
		data: () => data,
		methods: {
			async getTreeData() {
				const {
					data: result
				} = await this.$axios.get("/territory/getTerritoryTree");

				if (result.code == 0) {
					console.log(result.data);
					this.treeData = result.data;
				} else {
					this.$message.error("获取信息失败");
				}
			},
			handleNodeClick(data) {

				this.canAdd = (data.type == 1);
				this.checkedId = data.id;
				this.tableData = [];
				if(!this.canAdd){
					this.getTableData(data.id);
				}
			},
			addTerritory() {
				var _this = this;
				this.$prompt('请输入领域名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(async ({
					value
				}) => {

					if (value == null || value.length < 2) {
						_this.$message.error("请输入至少2个字符");
					}
					const {
						data: result
					} = await _this.$axios.post("/territory/add?name=" + value);
					if (result.code == 0) {
						_this.$message.success("添加成功");
						this.canAdd = false;
						this.getTreeData();
					}

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			addProduct(){
				var _this = this;
				var checkedId =  this.checkedId;

				 var dataObj = this.treeData.find(o => o.id == checkedId );
						
				this.$prompt('为[ '+dataObj.label+' ]领域添加一个产品分类', '', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(async ({ value }) => {
							
				         if (value == null || value.length < 2) {
				         	_this.$message.error("请输入至少2个字符");
				         }
						 
						const {data:result} = await _this.$axios.post("/territory/addProduct?name="+value+"&tId="+_this.checkedId);
						if(result.code == 0){
							_this.$message.success("添加成功");
							dataObj.children.push({
								'label' : value,
								'id'    : result.data,
								'type'  : 2,
								'children':[]
							});
							
						}
						  
				        }).catch(() => {
				         
						 
						 
				        });
			},
			// 获取产品信息 
			 async getTableData(productId){
				const { data : result } = await this.$axios.get('/product/get?productId='+productId);
				this.tableData = result.data;
				console.log(this.tableData);
			},
			//删除产品
			async delProduct(productId){
				var _this = this;
				var data = await this.$axios.post("/territory/delete/"+productId);
				if(data.data.code==0){
					this.treeData.forEach( o =>{
						console.log(o.children);
						o.children.splice(o.children.findIndex( o => o.id ==productId),1);
					})
				}
				this.$message.success(data.data.msg);
				
				
				
			}
			
		},
		created() {
			this.getTreeData();
			this.frontUrl = this.$frontUrl;
		}
	};
</script>

<style>
	.el-tree-node__label {
		font-size: 16px;
	}

	.el-tree-node__content {
		height: 45px;
	}

	.territoryFont {
		color: green;
	}

	.productFont {
		color: pink;
	}
</style>
