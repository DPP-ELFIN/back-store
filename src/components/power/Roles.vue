<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>角色管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card>
			<!-- 添加角色-->
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>

			<!--角色列表  -->
			<el-table :data="roleList" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<!-- 一级权限 -->
						<el-row :class="['bd-bottom',index == 0?'bd-top':'','vcenter']"
							v-for="(item1,index) in scope.row.children" :key="item1.id">
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 二级、三级权限 -->
							<el-col :span="19">
								<!-- 二级权限 -->
								<el-row :class="[index2 == 0?'':'bd-top','vcenter']"
									v-for="(item2,index2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<!-- 三级权限 -->
									<el-col :span="18">
										<el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id"
											closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="权限名称" prop="roleName"></el-table-column>
				<el-table-column label="权限描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" @click ="showRightsDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<!-- 分配权限对话框 -->
		<el-dialog
		  title="提示"
		  :visible.sync="setRighsVisible"
		  width="50%" @close="setRighsClosed">
		  <!-- 树形控件-->
		  <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defArr" ref="treeRef"></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRighsVisible = false">取 消</el-button>
		    <el-button type="primary" @click="allotRights" >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//角色列表数据
				roleList: [],
				//设置显示权限对话框
				setRighsVisible:false,
				//权限列表数据
				rightList:[],
				//树形控件属性绑定对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				defArr:[],//默认勾选数组
				roleId:''//当前即将分配权限的角色ID
			}
		},
		created() {
			this.getRoleList()
		},
		methods: {
			//获取角色列表
			async getRoleList() {
				const {
					data: res
				} = await this.$axios.get('roles')
				if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
				this.roleList = res.data
				//console.log(this.roleList)
			},
			//根据id删除对应的权限
			 async removeRightById(role,rightId) {
				const confrimResult = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err=>err);
				//console.log(confrimResult)
				if(confrimResult == 'cancel') return this.$message.error('已取消操作')
				
				//发起请求删除权限
				const {data:res} = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
				//console.log(res)
				if(res.meta.status != 200) return this.$message.error('删除权限失败')				
				role.children = res.data
			},
			//显示对话框
			async showRightsDialog(role){
				
				this.roleId = role.id
				
				//获取权限数据
				const {data:res} = await this.$axios.get('rights/tree')
				 if(res.meta.status !== 200) return this.$message.error('获取权限数据失败')
				 this.rightList = res.data
				 
				 this.getLeefKeys(role,this.defArr)
				 //console.log(this.rightList)
				this.setRighsVisible = true
			},
			//获取三级权限的ID并保存到defArr数组中
			getLeefKeys(node,arr){
				if(!node.children){
					return arr.push(node.id)
				}
				node.children.forEach(item=>{
					this.getLeefKeys(item,arr)
				})
			},
			//监听分配权限对话框事件
			setRighsClosed(){
				this.defArr = []
			},
			//为角色分配权限
			async allotRights(){
				const keys= [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
			
			const idStr = keys.join(',')
			
			const {data:res} = await this.$axios.post(`roles/${this.roleId}/rights`,{rids:idStr})
			console.log(res)
			if(res.meta.status !== 200) return this.$message.error('更新用户权限失败')
			this.$message.success('更新用户权限成功')
			this.getRoleList()
			this.setRighsVisible = false
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.el-tag {
		margin: 7px;
	}

	.bd-top {
		border-top: 1px solid #eee;
	}

	.bd-bottom {
		border-bottom: 1px solid #eee;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
