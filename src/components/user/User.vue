<template>
	<div>
		<!-- 面包屑导航条 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区 -->
		<el-card>
			<!-- // 搜索区 -->
			<el-row :gutter="20">
				<el-col :span="9">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<!--   //用户数据区 -->
			<el-table :data="userList" stripe border>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="uerStateChange(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope="scope">
						<!-- 编辑按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
						<!-- 设置按钮 -->
						<el-tooltip effect="dark" content="设置角色" placement="top" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<!-- //添加用户弹框 -->
		<el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addUserFormClose">
			<span>
				<!-- //添加用户表单 -->
				<el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserRef" label-width="70px">
					<el-form-item label="用户名" prop="name">
						<el-input v-model="addUserForm.name"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="addUserForm.password"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="addUserForm.email"></el-input>
					</el-form-item>
					<el-form-item label="手机" prop="mobile">
						<el-input v-model="addUserForm.mobile"></el-input>
					</el-form-item>
				</el-form>
			</span>
			<!-- //页脚 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑用户弹框 -->
		<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editUserFormClose">
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
			  <el-form-item label="用户名" >
			    <el-input v-model="editForm.username" disabled></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱"  prop="email">
			    <el-input v-model="editForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="电话" prop="mobile">
			    <el-input v-model="editForm.mobile" ></el-input>
			  </el-form-item>
			  </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {

			//邮箱校验规则
			var checkEmail = (rule, value, cb) => {
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
				if (regEmail.test(value)) return cb();
				cb(new Error('请输入合法的邮箱'))
			}
			//电话校验规则
			var checkMobile = (rule, value, cb) => {
				const checkMobile = /^(0|86)?(13[0-9]|15[0-9]|17[0-9]|18|14[0-9])[0-9]{8}$/
				if (checkMobile.test(value)) return cb();
				cb(new Error('请输入合法的电话'))
			}

			return {
				//用户列表参数
				queryInfo: {
					query: '',
					pagenum: 1, //当前页数
					pagesize: 2 //当前每页显示多少条数据
				},
				userList: [],
				total: 0, //全部数据数量
				dialogVisible: false, //添加用户弹窗状态
				editDialogVisible:false,//编辑用户弹窗状态
				editForm:{},		//编辑用户表单数据
				//添加用户
				addUserForm: {
					name: '',
					password: '',
					email: '',
					mobile: ''
				},
				//添加用户验证规则
				addUserFormRules: {
					name: [{
							required: true,
							message: '请输入用户名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在 6 到 15 个字符',
							trigger: 'blur'
						}
					],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
							required: true,
							message: '请输入电话',
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					]
				},
				//编辑用户验证规则
				editFormRules:{
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
							required: true,
							message: '请输入电话',
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}]
				},
			}
		},
		methods: {
			//获取用户信息
			async getUserList() {
				const {
					data: res
				} = await this.$axios.get('users', {
					params: this.queryInfo
				})
				if (res.meta.status != 200) return this.$message.error('获取用户信息失败')
				this.userList = res.data.users
				this.total = res.data.total
				//console.log(res)			
			},
			//监听pagesize改变事件
			handleSizeChange(newSize) {
				//console.log(newSize)
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			//监听页码值改变事件
			handleCurrentChange(newSize) {
				this.queryInfo.pagenum = newSize
				this.getUserList()
			},
			//监听用户状态变事件
			async uerStateChange(userInfo) {
				//console.log(userInfo)
				const {
					data: res
				} = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.ms_state}`)
				if (res.meta.status !== 200) {
					//console.log(userInfo)
					//console.log(res)
					userInfo.ms_state = !userInfo.ms_state
					return this.$message.error('更新用户状态失败')
				}
				this.$message.success('更新状态成功')
			},
			//监听用户表单事件
			addUserFormClose() {
				//重置表单
				this.$refs.addUserRef.resetFields()
			},
			//添加用户
			addUser() {
				this.$refs.addUserRef.validate(async valid => {
					//console.log(valid)
					if (!valid) return
					const {
						data: res
					} = await this.$axios.post('users', this.addUserForm)
					console.log(res)
					if (res.meta.status !== 201) return this.$message.error('添加用户失败')
					this.$message.success('添加用户成功')
					this.dialogVisible = false
					this.getUserList()
				})
			},
			//编辑用户
			async editUser(id) {
				//console.log(id)
				const {data:res} = await this.$axios.get('users/'+id)
				if(res.meta.status !== 200) return this.$message.error('查询用户信息失败')
				//console.log(res)
				this.editForm = res.data
				this.editDialogVisible = true
			},
			//监听编辑用户表单事件
			editUserFormClose(){
				this.$refs.editFormRef.resetFields()
			},
			//更新用户信息
			editUserInfo(){
				this.$refs.editFormRef.validate(async valid=>{
					if (!valid) return
					//发起修改用户信息请求
					const {data:res} = await this.$axios.put('users/'+this.editForm.id,{email: this.editForm.email,mobile: this.editForm.mobile})
					//console.log(res)
					if(res.meta.status !== 200) return this.$message.error('更新失败')
					this.$message.success('更新成功')
					this.getUserList()
					this.editDialogVisible = false
				})
			},
			//根据ID删除用户信息
			async removeUser(id){
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err =>err)
						//this.$confirm为一个promise对象，成功返回confirm，失败返回cancel
						//console.log(confirmResult)
						if(confirmResult !== 'confirm') return this.$message.info('取消删除')
						//this.$message.success('确认删除')
						const {data:res} = await this.$axios.delete('users/'+id)
						if(res.meta.status !== 200)return this.$message.error('删除失败')
						this.$message.success('删除成功')
						this.getUserList()
			}
		},
		created() {
			this.getUserList()
		}
	}
</script>

<style lang="less" scoped="scoped">
	.el-table {
		margin-top: 15px;
	}
</style>
