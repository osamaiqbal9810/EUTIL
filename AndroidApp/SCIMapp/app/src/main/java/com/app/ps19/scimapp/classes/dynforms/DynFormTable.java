package com.app.ps19.scimapp.classes.dynforms;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class DynFormTable implements IConvertHelper,IViewController {

    private DynForm form;
    //private HashMap<String, JSONArray> formData;
    private ArrayList<DynForm> formData;
    private String selectedItem;
    public void setSelectedItem(String selectedItem){this.selectedItem=selectedItem;}
    public String getSelectedItem(){return this.selectedItem;}

    public ArrayList<DynForm> getFormData(){return  this.formData;}
    public void setFormData(ArrayList<DynForm> formData){this.formData=formData;}

    public LinearLayout getLayoutTable() {
        return layoutTable;
    }

    public void setLayoutTable(LinearLayout layoutTable) {
        this.layoutTable = layoutTable;
    }

    private LinearLayout layoutTable;
    private Context context;
    private DynFormControl parentControl;

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    private String tableName;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }


    public DynForm getForm() {
        return form;
    }

    public void setForm(DynForm form) {
        this.form = form;
    }
    public boolean generateLayout(Context context){
        if( form !=null){

            return form.generateLayout(context);
        }
        return false;
    }
    public DynFormTable(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public DynFormTable(DynFormControl control,JSONArray ja){
        this.parentControl=control;
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("form",ja);
            parseJsonObject(jsonObject);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public void removeRow(DynForm form){
        this.layoutTable.removeView(form.getLayoutListItem());
        this.getFormData().remove(form);
    }
    public DynForm addNewRow(){

        try {
            DynForm form1=(DynForm) getForm().clone();
            form1.setChangeEventListener(this.parentControl.getListener());
            form1.cloneFieldList(this.getForm().getFormControlList());
            form1.setFormName(this.parentControl.getFieldName());
            form1.setChangeEventListener(this.parentControl.getListener());
            form1.setParentControl(this.parentControl);
            this.getFormData().add(form1);
            //form1.generateListItemLayout(this.parentControl.getParentControl().getContext());
            form1.generateListItemLayout(this.getContext());
            this.getLayoutTable().addView(form1.getLayoutListItem());
            return form1;
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return null;
    }
    public boolean generateListLayout(Context context, final OnValueChangeEventListener valueChangeEventListener){
        LinearLayout layout=null;

        if(context !=null){
            this.context=context;
        }

        if(this.context == null){
            return false;
        }
        if(this.form == null){
            return false;
        }
        ArrayList<DynFormControl> formControlList=this.form.getFormControlList();
        try {
            if (formControlList.size() > 0) {
                layout = new LinearLayout(this.context);
                layout.setOrientation(LinearLayout.VERTICAL);
                layout.setVisibility(View.VISIBLE);
                layout.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT));
                setMargins(layout, 30, 10, 10, 10);

                LayoutInflater inflater = LayoutInflater.from(context);
                LinearLayout layoutTitle =  (LinearLayout) inflater.inflate(R.layout.object_section_title, null, false);

                TextView tvCaption=(TextView) layoutTitle.findViewById(R.id.tvTitle_ost);
                tvCaption.setText(tableName);
                ImageButton btnAdd=layoutTitle.findViewById(R.id.btnAdd_ost);
                layout.addView(layoutTitle);
                btnAdd.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        //Toast.makeText(DynFormTable.this.context,"Add code goes here",Toast.LENGTH_SHORT).show();
                        if(valueChangeEventListener!=null) {
                            valueChangeEventListener.onObjectAddClick(parentControl);
                        }
                    }
                });
                /*
                Button btnAdd = new Button(this.context);
                btnAdd.setOnClickListener(addClickListener);
                btnAdd.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT));
                String addText = "Add";
                if (tableName != null) {
                    addText = "Add " + tableName;
                }
                btnAdd.setText(addText);
                layout.addView(btnAdd);*/
                if (formData != null) {
                    if (formData.size() != 0) {
                        for(DynForm form:this.formData) {
                            form.setChangeEventListener(valueChangeEventListener);
                            if(form.generateListItemLayout(context)){
                                LinearLayout layoutListItem=form.getLayoutListItem();
                                layout.addView(layoutListItem);
                            }
                        }

                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        this.layoutTable =layout;
        return  true;
    }
    private void setPadding (View view, int left, int top, int right, int bottom) {
        final float scale =((Activity) this.context).getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l = (int) (left * scale + 0.5f);
        int r = (int) (right * scale + 0.5f);
        int t = (int) (top * scale + 0.5f);
        int b = (int) (bottom * scale + 0.5f);
        view.setPadding(l,t,r,b);
    }
    private void setMargins (View view, int left, int top, int right, int bottom) {
        final float scale = ((Activity) this.context).getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l =  (int)(left * scale + 0.5f);
        int r =  (int)(right * scale + 0.5f);
        int t =  (int)(top * scale + 0.5f);
        int b =  (int)(bottom * scale + 0.5f);

        view.setLeft(l);
        view.setTop(t);
        view.setRight(r);
        view.setBottom(b);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try{
            //JSONArray ja=jsonObject.getJSONArray("form");
            this.form=new DynForm(jsonObject);
            //this.formData=new HashMap<>();
            this.formData=new ArrayList<>();
        }catch (Exception e){
            Log.e("DynFrmT parseJsonObject",e.toString());
            return  false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=null;
        try {
            if(formData !=null && formData.size()>0){
                JSONArray ja=new JSONArray();
                for(DynForm form:formData){
                    //JSONArray jaForm=new JSONArray();
                    JSONObject joForm=form.getJsonObject();
                    if(joForm !=null){
                        //jaForm.put(joForm);
                        //ja.put(jaForm);
                        ja.put(joForm);
                    }
                }
                jsonObject=new JSONObject();
                jsonObject.put("value",ja);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    @Override
    public void viewListenerChanged(OnValueChangeEventListener listener) {
        this.form.viewListenerChanged(listener);
        for(DynForm form:this.formData){
            form.viewListenerChanged(listener);
        }
    }

    @Override
    public void viewChanged(Context context) {
        if(this.context !=null){
            if(!this.context.equals(context)){
                this.context=context;
                this.setLayoutTable(null);
                List<DynForm> forms=this.getFormData();

                for(DynForm form:forms){
                    if(!form.getContext().equals(context)){
                        form.viewChanged(context);
                    }
                }
                this.form.viewChanged(context);
                this.layoutTable=null;
            }
        }
    }

    @Override
    public void viewClosed() {
        this.context=null;
        this.setLayoutTable(null);
        List<DynForm> forms=this.getFormData();

        for(DynForm form:forms){
            form.viewClosed();
        }
        this.form.viewClosed();
        this.layoutTable=null;
    }

}
