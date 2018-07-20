package com.my.taxipool.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

/**
 * Created by jeyhoon on 15. 10. 28..
 */
public class Set {
    private static String PREFERENCE_NAME="setting";
    public static void init(String preferenceName){
        PREFERENCE_NAME=preferenceName;
    }
    public static void Delete(Context ctx, String key) {
            SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        ed.remove(key); // 삭제
        ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!

    }
    public static void Delete(Context ctx){
        SharedPreferences pref = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.clear();
        editor.commit();
    }

    public static void Save(Context ctx, String key, String value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        ed.putString(key, value); // value : 저장될 값,
        ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!
    }

    public static void Save(Context ctx, String key, int value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        ed.putInt(key, value); // value : 저장될 값,
        ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!
    }

    public static void Save(Context ctx, String key, boolean value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        ed.putBoolean(key, value); // value : 저장될 값,
        ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!
    }
    public static void Save(Context ctx, String key, long value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        ed.putLong(key, value); // value : 저장될 값,
        ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!
    }
    public static void Save(Context ctx, String key, float value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        ed.putFloat(key, value); // value : 저장될 값,
        ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!
    }
    public static void Save(Context ctx, String key, ArrayList<String> values) {
			/*SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
					ctx.MODE_PRIVATE);
			SharedPreferences.Editor ed = prefs.edit();
			ed.putString(key, value); // value : 저장될 값,
			ed.commit(); // 필수! 이것을 안해주면 저장이 안되요!*/
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(ctx);
        SharedPreferences.Editor editor = prefs.edit();
        JSONArray a = new JSONArray();
        for (int i = 0; i < values.size(); i++) {
            a.put(values.get(i));
        }
        if (!values.isEmpty()) {
            editor.putString(key, a.toString());
        } else {
            editor.putString(key, null);
        }
        editor.commit();
    }

    public static String Load(Context ctx, String key, String default_value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        return prefs.getString(key, default_value);
    }

    public static int Load(Context ctx, String key, int default_value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        return prefs.getInt(key, default_value);
    }

    public static boolean Load(Context ctx, String key,
                               boolean default_value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        return prefs.getBoolean(key, default_value);
    }

    public static long Load(Context ctx, String key,
                            long default_value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        return prefs.getLong(key, default_value);
    }
    public static float Load(Context ctx, String key,
                             float default_value) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
                ctx.MODE_PRIVATE);
        return prefs.getFloat(key, default_value);
    }
    public static ArrayList<String> Load(Context ctx, String key) {
			/*SharedPreferences prefs = ctx.getSharedPreferences(PREFERENCE_NAME,
					ctx.MODE_PRIVATE);
			return prefs.getBoolean(key, default_value);*/
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(ctx);
        String json = prefs.getString(key, null);
        ArrayList<String> urls = new ArrayList<String>();
        if (json != null) {
            try {
                JSONArray a = new JSONArray(json);
                for (int i = 0; i < a.length(); i++) {
                    String url = a.optString(i);
                    urls.add(url);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return urls;
    }
}
