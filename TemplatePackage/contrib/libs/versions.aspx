<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>

<script runat="server">
		void Page_Load(object sender, System.EventArgs e) 
		{
				DirectoryInfo dirInfo = new DirectoryInfo(@"\\APD-V-NCHM-VSS1\idk1\TemplatePackage\3.0\js\versions\", "*", SearchOption.AllDirectories);
				FileInfo[] allFiles = dirInfo.GetFiles("*");

				foreach (FileInfo file in allFiles) {
					Response.Write(@"<li><a href="" + file.Name + "">" + file.Name + "</a></li>");
				}
		} 
</script>
