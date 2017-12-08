import java.io.*;
import java.net.*;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;


public class Sessions {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		//String url = "jdbc:mysql://dev.health2.me/";
        //String dbName = "monimed";
        //String userName = "monimed"; 
        //String password = "ardiLLA98";
        
		InetAddress iAddress = InetAddress.getLocalHost();
		String canonicalHostName = iAddress.getCanonicalHostName();
        String hostName = iAddress.getHostName();
		String fname;
		System.out.println(hostName);
    	if(canonicalHostName.equals("10.112.65.124"))
		{
			fname="Database_dev.txt";
		}
		else if(canonicalHostName.equals("10.12.83.120"))
		{
			fname="Database_prod.txt";
		}
        else if(canonicalHostName.equals("ip-10-179-161-178.ec2.internal"))
        {
            fname="Database_beta.txt";
        }
		else
		{
			writeLog("Cannot Identify Server");
			return;
		}
		System.out.println(fname);
		BufferedReader br = new BufferedReader(new FileReader("/var/www/vhost1/environment_details/"+fname));
		String line1;
		String content="";
		while ((line1 = br.readLine()) != null) 
		{
			content = content + line1;
		}
		br.close();
		
		String [] env = content.split(";");
		String url = "jdbc:mysql://"+(env[0].split("="))[1].replaceAll("\"","") + "/";
    	String dbName = (env[1].split("="))[1].replaceAll("\"","");
		String userName = (env[2].split("="))[1].replaceAll("\"",""); 
        String password = (env[3].split("="))[1].replaceAll("\"","");
		
		
        try
        {
        	String query = "select * from ongoing_sessions where (TIMESTAMPDIFF(MINUTE,lastseen,now()) > 7)";
        	
        	Class.forName("com.mysql.jdbc.Driver").newInstance(); 
        	Connection conn = DriverManager.getConnection(url+dbName,userName,password);
        	Statement stmt = conn.createStatement();
        	ResultSet rs = stmt.executeQuery(query);
        	//System.out.println("Here");
        	while(rs.next())
        	{
        		int userid = rs.getInt(1);
        		String ip = rs.getString(3);
        		//System.out.println(userid + "   " + ip);
        		String del_query = "delete from ongoing_sessions where userid=" + userid + " and ip='"+ip+"'";
				//System.out.println(del_query);
        		Statement stmt_del = conn.createStatement();
        		stmt_del.executeUpdate(del_query);
        		writeLog("Session Ended for "+userid + "("+ip+")");
        		
        		String check_query = "select * from ongoing_sessions where userid="+userid;
        		Statement stmt_folder = conn.createStatement();
        		ResultSet rs1 = stmt_folder.executeQuery(check_query);
        		rs1.last();
        		int count = rs1.getRow();
        		if(count == 0)
        		{
					String command = "rm -rf /var/www/vhost1/temp/" + userid;
					Process p = Runtime.getRuntime().exec(command);
					int status = p.waitFor();
					System.out.println(status);
					System.out.println("Deleting folder /temp/"+userid);
        			writeLog("Deleted Folder /temp/"+userid);
        			
        		}
        	
        		
        		
        	}
        	
        	
        	
        	
        	
        }
        catch(Exception e)
        {
			e.printStackTrace();
        	writeLog("Database Problem");
        }
        
        
        
        
        
        
		

	}

	static void writeLog(String s)
	{
		try 
		{
			String fdate = new SimpleDateFormat("yyyyMMdd").format(Calendar.getInstance().getTime());
		    PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("/var/www/vhost1/Session/Logs/Session_log_"+fdate, true)));
		    String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(Calendar.getInstance().getTime());
			out.println(s + " at "+timestamp);
		    out.close();
		} catch (IOException e) {
		    System.out.println("Error writing to Log");
		}
	
	}
}
